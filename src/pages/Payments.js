import React, { useEffect, useState } from 'react';
import { Table, Tag, DatePicker, Button, Input, Select, Space } from 'antd'; // ✅ Select और Space भी import
import PaymentEntryModal from '../components/PaymentEntryModal';
import { useSelector, useDispatch } from 'react-redux';
import { updateMonthlyPayments } from '../redux/fetures/PaymentSlice';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';  
dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select; // ✅

const Payments = () => {
  const payments = useSelector((state) => state.payment?.payments || []);
  const dispatch = useDispatch();

  const [dates, setDates] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // ✅ New state for status
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    dispatch(updateMonthlyPayments());
  }, []);

  const filteredData = payments.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const dateMatch = dates
      ? item?.payments?.some(payment =>
          dayjs(payment.date).isBetween(dates[0], dates[1], null, '[]')
        )
      : true;
    const statusMatch = statusFilter ? item.status === statusFilter : true;
    return nameMatch && dateMatch && statusMatch;
  });

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredData.length,
    }));
  }, [filteredData]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const resetFilters = () => {
    setSearchText("");
    setDates(null);
    setStatusFilter("");
  };

  const columns = [
    {
      title: "Sr.",
      render: (text, record, index) => index + 1
    },
    { title: 'Customar Name', dataIndex: 'name' },
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
        <Tag color={record.dueAmount > 0 ? "red" : "green"}>
          {record.dueAmount > 0 ? 'Due' : 'Paid'}
        </Tag>
      )
    },
    {
      title: 'Payment History',
      dataIndex: 'payments',
      render: (payments) => (
        Array.isArray(payments)
          ? payments.map((pay, index) => (
            <div key={index}>
              ₹{pay.amount} — {dayjs(pay.date).format('DD/MM/YYYY')}
            </div>
          ))
          : null
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      
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

        <Button onClick={resetFilters}>
          Reset Filters
        </Button>

        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
        >
          Add Payment
        </Button>
      </Space>

      <PaymentEntryModal
        visible={isModalVisible}
        onAdd={(paymentData) => {
          console.log("New payment added:", paymentData);
          setIsModalVisible(false);
        }}
        onCancel={() => setIsModalVisible(false)}
      />

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="cartNumber"
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Payments;





// add new search by customer name logic by chtgpt



// import React, { useEffect, useState } from 'react';
// import { Table, Tag, DatePicker, Button, Input } from 'antd'; // ✅ Input भी import करो
// import PaymentEntryModal from '../components/PaymentEntryModal';
// import { useSelector, useDispatch } from 'react-redux';
// import { updateMonthlyPayments } from '../redux/fetures/PaymentSlice';
// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';  
// dayjs.extend(isBetween);

// const { RangePicker } = DatePicker;
// const { Search } = Input; // ✅ AntD का Search Input

// const Payments = () => {
//   const payments = useSelector((state) => state.payment?.payments || []);
//   const dispatch = useDispatch();
//   const [dates, setDates] = useState(null);
//   const [searchText, setSearchText] = useState(""); // ✅ New state for search
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
//     return nameMatch && dateMatch;
//   });

//   useEffect(() => {
//     setPagination(prev => ({
//       ...prev,
//       total: filteredData.length,
//     }));
//   }, [filteredData]);

//   const handleTableChange = (pagination) => {
//     setPagination(pagination);
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
//       render: (amount, record) => {
//         return (
//           <span style={{ color: record.dueAmount > 0 ? 'red' : 'green', fontWeight: 'bold' }}>
//             ₹{record.dueAmount > 0 ? record.dueAmount : 0}
//           </span>
//         );
//       }
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
      
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
//         <RangePicker onChange={(dates) => setDates(dates)} />

//         <Search
//           placeholder="Search by customer name"
//           allowClear
//           onChange={(e) => setSearchText(e.target.value)}
//           style={{ width: 250 }}
//         />

//         <Button
//           type="primary"
//           onClick={() => setIsModalVisible(true)}
//         >
//           Add Payment
//         </Button>
//       </div>

//       <PaymentEntryModal
//         visible={isModalVisible}
//         onAdd={(paymentData) => {
//           console.log("New payment added:", paymentData);
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
