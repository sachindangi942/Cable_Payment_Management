import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, DatePicker, Spin, } from 'antd';
import CustomerTable from '../components/CustomerTable';
import CustomerFormModal from '../components/CustomerFormModel';
import { db } from '../components/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '../redux/fetures/LoadingSlice';
import { toast } from 'react-toastify';

const { RangePicker } = DatePicker;

const Customers = () => {
  const [customarData, setCustomarData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [dates, setDates] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const { loading } = useSelector(state => state.loading)
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomarData(data);
    });

    return () => unsubscribe();
  }, []);

  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setEditingCustomer(null);
    setIsModalVisible(false);
  };

  const handleAddCustomer = async (customer) => {
    try {
      dispatch(Loading(true));
      const docRef = await addDoc(collection(db, 'customers'), customer);
      await updateDoc(docRef, { id: docRef.id });
      closeModal();
      dispatch(Loading(false));
      toast.success("Customer added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      dispatch(Loading(false));
      closeModal();
      toast.error("Error adding customer!", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };
  const handleUpdateCustomer = async (updatedCustomer) => {
    try {
      dispatch(Loading(true));
      const { id, ...rest } = updatedCustomer;
      if (!id) {
        throw new Error("Customer ID is missing.");
      }

      const docRef = doc(db, 'customers', id);
      await updateDoc(docRef, rest);
      dispatch(Loading(false));
      closeModal();
      toast.success("Customer updated successfully!", {
        position: "top-right",
        autoClose: 3000
      });
    } catch (error) {
      closeModal();
      dispatch(Loading(false));
      toast.error("Error updating Customer !", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      dispatch(Loading(true));
      await deleteDoc(doc(db, 'customers', id));
      dispatch(Loading(false));
      toast.success("Customers deleted successfully !", {
        position: "top-right",
        autoClose: 3000
      })
    } catch (error) {
      dispatch(Loading(false));
      toast.error("Error deleting customer!", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const handlePaidAmountChange = async (id, paidAmount) => {
    try {
      dispatch(Loading(true));
      const docRef = doc(db, 'customers', id);
      await updateDoc(docRef, { paidAmount });
      dispatch(Loading(false));
      toast.success("Payment updated successfully!", {
        position: "top-right",
        autoClose: 3000
      })
    } catch (error) {
      dispatch(Loading(false));
      toast.error("Error updating payment!", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const filteredData = useMemo(() => {
    if (!dates) return customarData;
    return customarData.filter((customer) => {
      if (!customer.date) return false;
      const customerDate = new Date(customer.date);
      const start = new Date(dates[0].$d);
      const end = new Date(dates[1].$d);
      return customerDate >= start && customerDate <= end;
    });
  }, [customarData, dates]);

  return (
    <div className="p-3">
      {
        loading ? (
          <div className="d-flex justify-content-center align-items-start mt-5" style={{ height: '100vh' }}>
            <Spin tip="Loading customers..." size="large" fullscreen />
          </div>

        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
              <RangePicker onChange={(dates) => setDates(dates)} className="mb-2" />
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

            <Modal open={isModalVisible} onCancel={closeModal} footer={null} destroyOnClose>
              <CustomerFormModal
                onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
                initialValues={editingCustomer}
              />
            </Modal>
          </>
        )

      }
    </div>
  );
};

export default Customers;
