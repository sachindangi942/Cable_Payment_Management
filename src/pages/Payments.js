// import React, { useEffect, useState } from 'react';
// import { Table, Tag, DatePicker, Button } from 'antd';
// import dayjs from 'dayjs';
// import PaymentEntryModal from '../components/PaymentEntryModal';
// import { useSelector, useDispatch } from 'react-redux';
// import { updateMonthlyPayments } from '../redux/fetures/PaymentSlice';

// const { RangePicker } = DatePicker;

// const Payments = () => {
//   const payments = useSelector((state) => state.payment?.payments || []);
//   const dispatch = useDispatch();
//   const [dates, setDates] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   // Auto Monthly Update
//   useEffect(() => {
//     dispatch(updateMonthlyPayments());
//   }, [dispatch]);

//   const filteredData = dates
//     ? payments.filter((item) =>
//         item?.payments?.some(payment =>
//           dayjs(payment.date).isBetween(dates[0], dates[1], null, '[]')
//         )
//       )
//     : payments;

//   // Table Columns
//   const columns = [
//     { title: 'Cart Number', dataIndex: 'cartNumber' },
//     { title: 'Name', dataIndex: 'name' },
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
//         // Calculate the due amount dynamically
//         const dueAmount = record.plan - record.totalPaidAmount;
//         const status = dueAmount > 0 ? 'Due' : 'Paid';

//         return (
//           <span style={{ color: dueAmount > 0 ? 'red' : 'green', fontWeight: 'bold' }}>
//             ₹{dueAmount > 0 ? dueAmount : 0}
//           </span>
//         );
//       }
//     },

//     {
//       title: 'Status',
//       dataIndex: 'status',
//       render: (status, record) => {
//         const dueAmount = record.plan - record.totalPaidAmount;
//         return (
//           <Tag color={dueAmount > 0 ? "red" : "green"}>
//             {dueAmount > 0 ? 'Due' : 'Paid'}
//           </Tag>
//         );
//       }
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
//       <RangePicker
//         style={{ marginBottom: 16 }}
//         onChange={(dates) => setDates(dates)}
//       />
//       <Button
//         type="primary"
//         onClick={() => setIsModalVisible(true)}
//         style={{ marginBottom: 16 }}
//       >
//         Add Payment
//       </Button>

//       <PaymentEntryModal
//         visible={isModalVisible}
//         onAdd={(paymentData) => {
//           console.log("New payment added:", paymentData);
//           setIsModalVisible(false);
//         }}
//         onCancel={() => setIsModalVisible(false)}
//       />

//       <Table columns={columns} dataSource={filteredData} rowKey="cartNumber" />
//     </div>
//   );
// };

// export default Payments;







import React, { useEffect, useState } from 'react';
import { Table, Tag, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import PaymentEntryModal from '../components/PaymentEntryModal';
import { useSelector, useDispatch } from 'react-redux';
import { updateMonthlyPayments } from '../redux/fetures/PaymentSlice';

const { RangePicker } = DatePicker;

const Payments = () => {
  const payments = useSelector((state) => state.payment?.payments || []);
  const dispatch = useDispatch();
  const [dates, setDates] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Auto Monthly Update
  useEffect(() => {
    dispatch(updateMonthlyPayments());
  }, [dispatch]);

  const filteredData = dates
    ? payments.filter((item) =>
        item?.payments?.some(payment =>
          dayjs(payment.date).isBetween(dates[0], dates[1], null, '[]')
        )
      )
    : payments;

  // Table Columns
  const columns = [
    { title: 'Cart Number', dataIndex: 'cartNumber' },
    { title: 'Name', dataIndex: 'name' },
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
      render: (amount, record) => {
        // Calculate the due amount dynamically
        const dueAmount = record.plan - record.totalPaidAmount;
        return (
          <span style={{ color: dueAmount > 0 ? 'red' : 'green', fontWeight: 'bold' }}>
            ₹{dueAmount > 0 ? dueAmount : 0}
          </span>
        );
      }
    },

    {
      title: 'Status',
      dataIndex: 'status',  // Added status in dataIndex
      render: (status, record) => {
        const dueAmount = record.plan - record.totalPaidAmount;
        return (
          <Tag color={dueAmount > 0 ? "red" : "green"}>
            {dueAmount > 0 ? 'Due' : 'Paid'}
          </Tag>
        );
      }
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
      <RangePicker
        style={{ marginBottom: 16 }}
        onChange={(dates) => setDates(dates)}
      />
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Add Payment
      </Button>

      <PaymentEntryModal
        visible={isModalVisible}
        onAdd={(paymentData) => {
          console.log("New payment added:", paymentData);
          setIsModalVisible(false);
        }}
        onCancel={() => setIsModalVisible(false)}
      />

      <Table columns={columns} dataSource={filteredData} rowKey="cartNumber" />
    </div>
  );
};

export default Payments;
