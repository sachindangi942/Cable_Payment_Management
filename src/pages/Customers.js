// import React, { useState } from 'react';
// import { Button, Input, Space } from 'antd';
// import CustomerTable from '../components/CustomerTable';
// import AddCustomerModal from '../components/AddCustomerModal';
// import EditCustomerModal from '../components/EditCustomerModal';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   addCustomare,
//   updateCustomer,
//   deleteCustomer, // ✅ delete action import
// } from '../redux/fetures/CustomerSlice';

// const Customers = () => {
//   const customers = useSelector((state) => state.customare?.customarData || []);
//   const dispatch = useDispatch();

//   const [search, setSearch] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   const handleAddCustomer = (newCustomer) => {
//     dispatch(addCustomare(newCustomer));
//     setShowAddModal(false);
//   };

//   const handleEditCustomer = (customer) => {
//     setSelectedCustomer(customer);
//     setShowEditModal(true);
//   };

//   const handleUpdateCustomer = (updatedCustomer) => {
//     dispatch(updateCustomer(updatedCustomer));
//     setShowEditModal(false);
//   };

//   const handleDeleteCustomar = (mobile) => {
//     dispatch(deleteCustomer(mobile));
//   };

//   // Handler for updating Paid Amount
//   const handlePaidAmountChange = (mobile, newPaidAmount, plan) => {
//     const customerToUpdate = customers.find((c) => c.mobile === mobile);
//     if (customerToUpdate) {
//       const updatedCustomer = {
//         ...customerToUpdate,
//         paidAmount: newPaidAmount,
//         dueAmount: plan - newPaidAmount,
//       };
//       dispatch(updateCustomer(updatedCustomer)); // Update the customer in Redux store
//     }
//   };

//   const filteredCustomers = customers.filter((c) =>
//     c.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div>
//       <Space style={{ marginBottom: 16 }}>
//         <Input.Search
//           placeholder="Search by name"
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <Button type="primary" onClick={() => setShowAddModal(true)}>
//           Add Customer
//         </Button>
//       </Space>

//       <CustomerTable
//         data={filteredCustomers}
//         onEdit={handleEditCustomer}
//         onDelete={handleDeleteCustomar} // ✅ now working
//         onPaidAmountChange={handlePaidAmountChange} // ✅ pass handler for paid amount change
//       />

//       <AddCustomerModal
//         visible={showAddModal}
//         onCancel={() => setShowAddModal(false)}
//         onAdd={handleAddCustomer}
//       />

//       <EditCustomerModal
//         visible={showEditModal}
//         onCancel={() => setShowEditModal(false)}
//         onUpdate={handleUpdateCustomer}
//         customer={selectedCustomer}
//       />
//     </div>
//   );
// };

// export default Customers;



import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import CustomerTable from '../components/CustomerTable';
import CustomerFormModal from '../components/CustomerFormModel';
import { addCustomer, deleteCustomer, editCustomer, addPaidAmount } from '../redux/fetures/CustomerSlice';

const Customers = () => {
  const dispatch = useDispatch();
  const { customarData } = useSelector((state) => state.customare);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleAddCustomer = (customer) => {
    dispatch(addCustomer(customer));
    setIsModalVisible(false);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsModalVisible(true);
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    dispatch(editCustomer({ mobile: updatedCustomer.mobile, updatedData: updatedCustomer }));
    setEditingCustomer(null);
    setIsModalVisible(false);
  };

  const handleDeleteCustomer = (mobile) => {
    dispatch(deleteCustomer(mobile));
  };

  const handlePaidAmountChange = (mobile, paidAmount, plan) => {
    dispatch(addPaidAmount({ mobile, paidAmount }));
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Add Customer
      </Button>
      <CustomerTable
        data={customarData}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        onPaidAmountChange={handlePaidAmountChange}
      />
      <Modal
        open={isModalVisible}
        onCancel={() => {
          setEditingCustomer(null);
          setIsModalVisible(false);
        }}
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
