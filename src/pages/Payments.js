import React, { useEffect, useState } from 'react';
import { Table, Tag, DatePicker, Button } from 'antd';
import PaymentEntryModal from '../components/PaymentEntryModal';
import { useSelector, useDispatch } from 'react-redux';
import { updateMonthlyPayments } from '../redux/fetures/PaymentSlice';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';   // ✅ Add this
dayjs.extend(isBetween);                          // ✅ And this


const { RangePicker } = DatePicker;

const Payments = () => {
  const payments = useSelector((state) => state.payment?.payments || []);
  const dispatch = useDispatch();
  const [dates, setDates] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, // Show 5 entries per page
    total: 0,
  });

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

  // Update total count when filtered data changes
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredData.length,
    }));
  }, [filteredData]);

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Table Columns (same as your existing columns)
  const columns = [
    {title:"Sr.",
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
      render: (amount, record) => {
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
      dataIndex: 'status',
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