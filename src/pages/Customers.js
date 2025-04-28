import React, { useMemo, useState } from 'react';
import { Button, Modal, DatePicker, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import CustomerTable from '../components/CustomerTable';
import CustomerFormModal from '../components/CustomerFormModel';
import { addCustomer, deleteCustomer, editCustomer, addPaidAmount } from '../redux/fetures/CustomerSlice';

const { RangePicker } = DatePicker;

const Customers = () => {
  const dispatch = useDispatch();
  const { customarData } = useSelector((state) => state.customare);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [dates, setDates] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  });
console.log("dates",dates);
console.log("redux date", customarData)
  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setEditingCustomer(null);
    setIsModalVisible(false);
  };

  const handleAddCustomer = (customer) => {
    dispatch(addCustomer(customer));
    message.success('Customer added successfully!');
    closeModal();
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    dispatch(editCustomer({ mobile: updatedCustomer.mobile, updatedData: updatedCustomer }));
    message.success('Customer updated successfully!');
    closeModal();
  };

  const handleDeleteCustomer = (mobile) => {
    dispatch(deleteCustomer(mobile));
    message.success('Customer deleted successfully!');
  };

  const handlePaidAmountChange = (mobile, paidAmount) => {
    dispatch(addPaidAmount({ mobile, paidAmount }));
    message.success('Payment updated successfully!');
  };

  // 🆕 Filter customers based on date range
  // const filteredData = dates
  //   ? customarData.filter((customer) => {
  //       const customerDate = new Date(customer.lastUpdatedMonth || customer.createdAt);
  //       return (
  //         customerDate >= dates[0].toDate() && customerDate <= dates[1].toDate()
  //       );
  //     })
  //   : customarData;


  const filteredData = useMemo(() => {
    if (!dates) return customarData;
  
    return customarData.filter((customer) => {
      const customerDateStr = customer.date; // 🔥 बस यहाँ change किया है
      if (!customerDateStr) return false; // Agar customer ke pass date hi nahi hai to ignore
  
      const customerDate = new Date(customerDateStr);
      const startDate = new Date(dates[0].$d);
      const endDate = new Date(dates[1].$d);
  
      const customerDateOnly = customerDate.setHours(0, 0, 0, 0);
      const startDateOnly = startDate.setHours(0, 0, 0, 0);
      const endDateOnly = endDate.setHours(0, 0, 0, 0);
  
      return customerDateOnly >= startDateOnly && customerDateOnly <= endDateOnly;
    });
  }, [customarData, dates]);
  





  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <RangePicker
          onChange={(dates) => setDates(dates)}
          className="mb-2"
        />
        <Button type="primary" onClick={() => openModal()} className="mb-2">
          Add Customer
        </Button>
      </div>

      <CustomerTable
        data={filteredData} 
        onEdit={openModal}
        onDelete={handleDeleteCustomer}
        onPaidAmountChange={handlePaidAmountChange}
        pagination={pagination}
        setPagination={setPagination}
      />

      <Modal
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <CustomerFormModal
          onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
          initialValues={editingCustomer}
        />
      </Modal>
    </div>
  );
};

export default Customers;





// import React, { useState, useMemo } from 'react';
// import { Button, Modal, DatePicker, message } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import CustomerTable from '../components/CustomerTable';
// import CustomerFormModal from '../components/CustomerFormModel';
// import { addCustomer, deleteCustomer, editCustomer, addPaidAmount } from '../redux/fetures/CustomerSlice';

// const { RangePicker } = DatePicker;

// const Customers = () => {
//   const dispatch = useDispatch();
//   const { customarData } = useSelector((state) => state.customare);

//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState(null);
//   const [dates, setDates] = useState(null);
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10
//   });

//   // 👉 Modal handlers
//   const openModal = (customer = null) => {
//     setEditingCustomer(customer);
//     setIsModalVisible(true);
//   };

//   const closeModal = () => {
//     setEditingCustomer(null);
//     setIsModalVisible(false);
//   };

//   // 👉 Customer action handlers
//   const handleAddCustomer = (customer) => {
//     dispatch(addCustomer(customer));
//     message.success('Customer added successfully!');
//     closeModal();
//   };

//   const handleUpdateCustomer = (updatedCustomer) => {
//     dispatch(editCustomer({ mobile: updatedCustomer.mobile, updatedData: updatedCustomer }));
//     message.success('Customer updated successfully!');
//     closeModal();
//   };

//   const handleDeleteCustomer = (mobile) => {
//     dispatch(deleteCustomer(mobile));
//     message.success('Customer deleted successfully!');
//   };

//   const handlePaidAmountChange = (mobile, paidAmount) => {
//     dispatch(addPaidAmount({ mobile, paidAmount }));
//     message.success('Payment updated successfully!');
//   };

//   // 👉 Helper function to check if customer is between selected dates
//   const isWithinRange = (customerDate, startDate, endDate) => {
//     const customerTime = new Date(customerDate).setHours(0, 0, 0, 0);
//     const startTime = new Date(startDate).setHours(0, 0, 0, 0);
//     const endTime = new Date(endDate).setHours(0, 0, 0, 0);

//     return customerTime >= startTime && customerTime <= endTime;
//   };

//   // 👉 Filtered customer list (using useMemo for optimization)
//   const filteredData = useMemo(() => {
//     if (!dates) return customarData;

//     return customarData.filter((customer) => {
//       const customerDate = customer.lastUpdatedMonth || customer.createdAt;
//       return isWithinRange(customerDate, dates[0].$d, dates[1].$d);
//     });
//   }, [customarData, dates]);

//   return (
//     <div className="p-3">
//       {/* Header buttons */}
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//         <RangePicker
//           onChange={(dates) => setDates(dates)}
//           className="mb-2"
//           allowClear
//         />
//         <Button type="primary" onClick={() => openModal()} className="mb-2">
//           Add Customer
//         </Button>
//       </div>

//       {/* Customer Table */}
//       <CustomerTable
//         data={filteredData}
//         onEdit={openModal}
//         onDelete={handleDeleteCustomer}
//         onPaidAmountChange={handlePaidAmountChange}
//         pagination={pagination}
//         setPagination={setPagination}
//       />

//       {/* Customer Form Modal */}
//       <Modal
//         open={isModalVisible}
//         onCancel={closeModal}
//         footer={null}
//         destroyOnClose
//       >
//         <CustomerFormModal
//           onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
//           initialValues={editingCustomer}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default Customers;
