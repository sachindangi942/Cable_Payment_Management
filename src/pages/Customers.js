// import React, { useState } from 'react';
// import { Button, Modal, DatePicker } from 'antd';
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

//   const handleAddCustomer = (customer) => {
//     dispatch(addCustomer(customer));
//     setIsModalVisible(false);
//   };

//   const handleEditCustomer = (customer) => {
//     setEditingCustomer(customer);
//     setIsModalVisible(true);
//   };

//   const handleUpdateCustomer = (updatedCustomer) => {
//     dispatch(editCustomer({ mobile: updatedCustomer.mobile, updatedData: updatedCustomer }));
//     setEditingCustomer(null);
//     setIsModalVisible(false);
//   };

//   const handleDeleteCustomer = (mobile) => {
//     dispatch(deleteCustomer(mobile));
//   };

//   const handlePaidAmountChange = (mobile, paidAmount, plan) => {
//     dispatch(addPaidAmount({ mobile, paidAmount }));
//   };

//   return (
//     <div>
//       <RangePicker
//         onChange={(dates) => setDates(dates)}
//       />
//       <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
//         Add Customer
//       </Button>
//       <CustomerTable
//         data={customarData}
//         onEdit={handleEditCustomer}
//         onDelete={handleDeleteCustomer}
//         onPaidAmountChange={handlePaidAmountChange}
//         pagination={pagination}
//         setPagination={setPagination}
//       />
//       <Modal
//         open={isModalVisible}
//         onCancel={() => {
//           setEditingCustomer(null);
//           setIsModalVisible(false);
//         }}
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




import React, { useState } from 'react';
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
  const filteredData = dates
    ? customarData.filter((customer) => {
        const customerDate = new Date(customer.lastUpdatedMonth || customer.createdAt);
        return (
          customerDate >= dates[0].toDate() && customerDate <= dates[1].toDate()
        );
      })
    : customarData;

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
