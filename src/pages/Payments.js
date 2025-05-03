// import React, { useEffect, useState } from 'react';
// import { Table, Tag, DatePicker, Button, Input, Select, Space } from 'antd'; // ✅ Select और Space भी import
// import PaymentEntryModal from '../components/PaymentEntryModal';
// import { useSelector, useDispatch } from 'react-redux';
// import { updateMonthlyPayments } from '../redux/fetures/PaymentSlice';
// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';  
// dayjs.extend(isBetween);

// const { RangePicker } = DatePicker;
// const { Search } = Input;
// const { Option } = Select; // ✅

// const Payments = () => {
//   const payments = useSelector((state) => state.payment?.payments || []);
//   const dispatch = useDispatch();

//   const [dates, setDates] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState(""); // ✅ New state for status
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//     total: 0,
//   });

//   useEffect(() => {
//     dispatch(updateMonthlyPayments());
//   }, [dispatch]);

//   const filteredData = payments.filter((item) => {
//     const nameMatch = item.name.toLowerCase().includes(searchText.toLowerCase());
//     const dateMatch = dates
//       ? item?.payments?.some(payment =>
//           dayjs(payment.date).isBetween(dates[0], dates[1], null, '[]')
//         )
//       : true;
//     const statusMatch = statusFilter ? item.status === statusFilter : true;
//     return nameMatch && dateMatch && statusMatch;
//   });

//   const handleTableChange = (pagination) => {
//     setPagination({
//       ...pagination,
//       total:filteredData.length
//     });
//   };

//   const resetFilters = () => {
//     setSearchText("");
//     setDates(null);
//     setStatusFilter("");
//   };

//   const columns = [
//     {
//       title: "Sr.",
//       render: (text, record, index) => index + 1
//     },
//     { title: 'Customar Name', dataIndex: 'name' },
//     { title: 'Cart Number', dataIndex: 'cartNumber' },
//     { title: 'Plan (₹)', dataIndex: 'plan' },
//     {
//       title: 'Total Paid Amount (₹)',
//       dataIndex: 'totalPaidAmount',
//       render: (amount) => (
//         <span style={{ color: 'green', fontWeight: 'bold' }}>
//           ₹{amount}
//         </span>
//       )
//     },
//     {
//       title: 'Due Amount (₹)',
//       dataIndex: 'dueAmount',
//       render: (amount, record) => (
//         <span style={{ color: record.dueAmount > 0 ? 'red' : 'green', fontWeight: 'bold' }}>
//           ₹{record.dueAmount > 0 ? record.dueAmount : 0}
//         </span>
//       )
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       render: (status, record) => (
//         <Tag color={record.dueAmount > 0 ? "red" : "green"}>
//           {record.dueAmount > 0 ? 'Due' : 'Paid'}
//         </Tag>
//       )
//     },
//     {
//       title: 'Payment History',
//       dataIndex: 'payments',
//       render: (payments) => (
//         Array.isArray(payments)
//           ? payments.map((pay, index) => (
//             <div key={index}>
//               ₹{pay.amount} — {dayjs(pay.date).format('DD/MM/YYYY')}
//             </div>
//           ))
//           : null
//       )
//     }
//   ];

//   return (
//     <div style={{ padding: 24 }}>

//       <Space style={{ marginBottom: 16 }} wrap>
//         <RangePicker onChange={(dates) => setDates(dates)} />

//         <Search
//           placeholder="Search by customer name"
//           allowClear
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           style={{ width: 250 }}
//         />

//         <Select
//           placeholder="Filter by Status"
//           allowClear
//           value={statusFilter || undefined}
//           onChange={(value) => setStatusFilter(value)}
//           style={{ width: 150 }}
//         >
//           <Option value="Paid">Paid</Option>
//           <Option value="Due">Due</Option>
//         </Select>

//         <Button onClick={resetFilters}>
//           Reset Filters
//         </Button>

//         <Button
//           type="primary"
//           onClick={() => setIsModalVisible(true)}
//         >
//           Add Payment
//         </Button>
//       </Space>

//       <PaymentEntryModal
//         visible={isModalVisible}
//         onAdd={(paymentData) => {
//           setIsModalVisible(false);
//         }}
//         onCancel={() => setIsModalVisible(false)}
//       />

//       <Table 
//         columns={columns} 
//         dataSource={filteredData} 
//         rowKey="cartNumber"
//         pagination={pagination}
//         onChange={handleTableChange}
//       />
//     </div>
//   );
// };

// export default Payments;




import React, { useEffect, useState } from 'react';
import { Table, Tag, DatePicker, Button, Input, Select, Space, Spin } from 'antd';
import PaymentEntryModal from '../components/PaymentEntryModal';
import { db } from '../components/firebase'; // ✅ Firebase config से Firestore import करें
import { collection, onSnapshot } from 'firebase/firestore';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { autoUpdateDueAmounts } from '../utils/autoUpdateDueAmounts';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '../redux/fetures/LoadingSlice';
dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;

const Payments = () => {
  const { loading } = useSelector(state => state.loading)
  const dispatch = useDispatch();
  const [payments, setPayments] = useState([]);
  const [dates, setDates] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    autoUpdateDueAmounts();
  }, []);

  useEffect(() => {
    dispatch(Loading(true));
    const unsubscribe = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const item = doc.data();
        const totalPaid = (item.payments || []).reduce((sum, p) => sum + p.amount, 0);
        const due = item.plan - totalPaid;

        return {
          ...item,
          id: doc.id,
          totalPaidAmount: totalPaid,
          dueAmount: due,
          status: due > 0 ? 'Due' : 'Paid',
        };
      });
      dispatch(Loading(false));
      setPayments(data);
    });

    return () => unsubscribe();
  }, [dispatch]);

  const filteredData = payments.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(searchText.toLowerCase());
    const dateMatch = dates
      ? item?.payments?.some(payment =>
        dayjs(payment.date).isBetween(dates[0], dates[1], null, '[]')
      )
      : true;
    const statusMatch = statusFilter ? item.status === statusFilter : true;
    return nameMatch && dateMatch && statusMatch;
  });

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      total: filteredData.length
    });
  };

  const resetFilters = () => {
    setSearchText('');
    setDates(null);
    setStatusFilter('');
    setPagination({ ...pagination, current: 1 });

  };

  const columns = [
    {
      title: 'Sr.',
      render: (text, record, index) => index + 1
    },
    { title: 'Customer Name', dataIndex: 'name' },
    { title: 'Cart Number', dataIndex: 'cartNumber' },
    { title: 'Plan (₹)', dataIndex: 'plan' },
    {
      title: 'Total Paid Amount (₹)',
      dataIndex: 'totalPaidAmount',
      render: (amount) => (
        <span style={{ color: 'green', fontWeight: 'bold' }}>
          ₹{amount}
        </span>
      )
    },
    {
      title: 'Due Amount (₹)',
      dataIndex: 'dueAmount',
      render: (amount, record) => (
        <span style={{ color: record.dueAmount > 0 ? 'red' : 'green', fontWeight: 'bold' }}>
          ₹{record.dueAmount > 0 ? record.dueAmount : 0}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status, record) => (
        <Tag color={record.dueAmount > 0 ? 'red' : 'green'}>
          {record.dueAmount > 0 ? 'Due' : 'Paid'}
        </Tag>
      )
    },
    {
      title: 'Payment History',
      dataIndex: 'payments',
      render: (payments) =>
        Array.isArray(payments)
          ? payments.map((pay, index) => (
            <div key={index}>
              ₹{pay.amount} — {dayjs(pay.date).format('DD/MM/YYYY')}
            </div>
          ))
          : null
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      {
        loading ? (
          <div className="d-flex justify-content-center align-items-start mt-5" style={{ height: '100vh' }}>
            <Spin tip="Loading payments..." size="large" fullscreen />
          </div>
        ) : (
          <>
            <Space style={{ marginBottom: 16 }} wrap>
              <RangePicker onChange={(dates) => setDates(dates)} />
              <Search
                placeholder="Search by customer name"
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />
              <Select
                placeholder="Filter by Status"
                allowClear
                value={statusFilter || undefined}
                onChange={(value) => setStatusFilter(value)}
                style={{ width: 150 }}
              >
                <Option value="Paid">Paid</Option>
                <Option value="Due">Due</Option>
              </Select>
              <Button onClick={resetFilters}>Reset Filters</Button>
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Add Payment
              </Button>
            </Space>

            <PaymentEntryModal
              visible={isModalVisible}
              onAdd={() => setIsModalVisible(false)}
              onCancel={() => setIsModalVisible(false)}
            />

            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="cartNumber"
              pagination={pagination}
              onChange={handleTableChange}
            />
          </>
        )
      }
    </div>
  );
};

export default Payments;
