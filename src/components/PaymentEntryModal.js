// import React from 'react';
// import { Modal, Form, InputNumber, Select, Input, notification } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { addPayment } from '../redux/fetures/PaymentSlice';
// import dayjs from 'dayjs';
// import { useWatch } from 'antd/es/form/Form';

// const PaymentEntryModal = ({ visible, onAdd, onCancel }) => {
//   const dispatch = useDispatch();
//   const { customarData } = useSelector(state => state.customare);
//   const { payments } = useSelector(state => state.payment);
//   const [form] = Form.useForm();
//   const planValue = useWatch("plan", form);

//   const handleAdd = async () => {
//     try {
//       const values = await form.validateFields();
//       const exitsPayment = payments.find(data=>data.cartNumber=== values.cartNumber);
//       console.log("exitsPayment",exitsPayment?.dueAmount)
//       if (exitsPayment?.status === "Paid") {
//         notification.warning({
//           message: 'Already Paid',
//           description: 'This customer has already completed their payment.',
//           duration: 3
//         });
//         return;
//       } else if (exitsPayment?.status === "Due") {
//         if (exitsPayment?.dueAmount < values.paidAmount) {
//           notification.warning({
//             message: "Extra Amount",
//             description: `Paid amount cannot be more than Due amount ${exitsPayment?.dueAmount}`,
//             duration: 3,
//             placement: "topRight"
//           });
//           return;
//         }
//       };
//       const formattedValues = {
//         ...values,
//         date: dayjs().format('YYYY-MM-DD'),
//       };
//       notification.success({
//         message: "Add Amounts",
//         description: "Amount added successfully !",
//         duration: 3,
//         placement: "topRight"
//       });
//       onAdd(formattedValues);
//       dispatch(addPayment(formattedValues));
//       form.resetFields();
//     } catch (error) {
//       // Validation fail hone par yeh chalega
//       notification.error({
//         message: "Failed",
//         description: "Amount added Failed!",
//         duration: 3,
//         placement: "topRight"
//       });
//     }
//   };


//   const handleCartNumberChange = (cartNumber) => {
//     const selectedCustomer = customarData.find(cust => cust.cartNumber === cartNumber);
//     if (selectedCustomer) {
//       form.setFieldsValue({
//         name: selectedCustomer.name,
//         plan: selectedCustomer.plan
//       });
//     }
//   };

//   return (
//     <Modal
//       open={visible}
//       title="Add Payment"
//       onCancel={() => {
//         form.resetFields();
//         onCancel();
//       }}
//       onOk={handleAdd}
//     >
//       <Form layout="vertical" form={form}>
//         <Form.Item label="Cart Number" name="cartNumber" rules={[{ required: true }]}>
//           <Select showSearch onChange={handleCartNumberChange}>
//             {customarData.map((customar) => (
//               <Select.Option key={customar.cartNumber} value={customar.cartNumber}>
//                 {customar.cartNumber}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item label="Name" name="name" rules={[{ required: true }]}>
//           <Input disabled />
//         </Form.Item>

//         <Form.Item label="Plan (₹)" name="plan" rules={[{ required: true }]}>
//           <InputNumber disabled style={{ width: '100%' }} />
//         </Form.Item>

//         <Form.Item
//           label="Paid Amount (₹)"
//           name="paidAmount"
//           rules={[{ required: true, message: "please enter paid amounts" },
//           ({ getFieldValue }) => ({
//             async validator(_, value) {
//               const plan = getFieldValue('plan');
//               if (value > plan) {
//                 notification.warning({
//                   message: "Extra amounts",
//                   description: "Paid amount cannot be more than plan amount",
//                   duration: 3,
//                   placement: "topRight"
//                 })
//                 throw new Error('Paid amount cannot be more than plan amount');
//               }
//             },
//           }),
//           ]}
//         >
//           <InputNumber
//             min={1}
//             disabled={!planValue}
//             style={{ width: '100%' }}
//           />
//         </Form.Item>

//       </Form>
//     </Modal>
//   );
// };

// export default PaymentEntryModal;





import React, { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, Select, Input, notification } from 'antd';
import { db } from '../components/firebase';
import {
  doc,
  updateDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import dayjs from 'dayjs';
import { useWatch } from 'antd/es/form/Form';

const PaymentEntryModal = ({ visible, onAdd, onCancel }) => {
  const [form] = Form.useForm();
  const planValue = useWatch("plan", form);

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const snapshot = await getDocs(collection(db, 'customers'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(data);
    };
    if (visible) fetchCustomers();
  }, [visible]);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const selectedCustomer = customers.find(c => c.cartNumber === values.cartNumber);

      if (!selectedCustomer) {
        notification.error({ message: 'Customer not found' });
        return;
      }

      const totalPaid = (selectedCustomer.payments || []).reduce((sum, p) => sum + p.amount, 0);
      const dueAmount = selectedCustomer.plan - totalPaid;

      if (dueAmount <= 0) {
        notification.warning({
          message: 'Already Paid',
          description: 'This customer has already completed their payment.',
          duration: 3
        });
        return;
      }

      if (values.paidAmount > dueAmount) {
        notification.warning({
          message: 'Extra Amount',
          description: `Paid amount cannot be more than due amount ₹${dueAmount}`,
          duration: 3,
          placement: "topRight"
        });
        return;
      }

      const newPayment = {
        amount: values.paidAmount,
        date: dayjs().format('YYYY-MM-DD'),
      };

      const customerRef = doc(db, 'customers', selectedCustomer.id);
      await updateDoc(customerRef, {
        payments: [...(selectedCustomer.payments || []), newPayment],
      });

      notification.success({
        message: 'Success',
        description: 'Payment added successfully!',
        duration: 3,
        placement: "topRight"
      });

      onAdd(); // parent component ke modal close karne ke liye
      form.resetFields();
    } catch (err) {
      console.error(err);
      notification.error({
        message: 'Error',
        description: 'Failed to add payment. Please try again.',
        duration: 3,
        placement: "topRight"
      });
    }
  };

  const handleCartNumberChange = (cartNumber) => {
    const selectedCustomer = customers.find(cust => cust.cartNumber === cartNumber);
    if (selectedCustomer) {
      form.setFieldsValue({
        name: selectedCustomer.name,
        plan: selectedCustomer.plan,
      });
    }
  };

  return (
    <Modal
      open={visible}
      title="Add Payment"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleAdd}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Cart Number" name="cartNumber" rules={[{ required: true }]}>
          <Select showSearch onChange={handleCartNumberChange}>
            {customers.map((cust) => (
              <Select.Option key={cust.cartNumber} value={cust.cartNumber}>
                {cust.cartNumber}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item label="Plan (₹)" name="plan" rules={[{ required: true }]}>
          <InputNumber disabled style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Paid Amount (₹)"
          name="paidAmount"
          rules={[{ required: true, message: "please enter paid amounts" },
          ({ getFieldValue }) => ({
            async validator(_, value) {
              const plan = getFieldValue('plan');
              if (value > plan) {
                notification.warning({
                  message: "Extra amounts",
                  description: "Paid amount cannot be more than plan amount",
                  duration: 3,
                  placement: "topRight"
                })
                throw new Error('Paid amount cannot be more than plan amount');
              }
            },
          }),
          ]}
        >
          <InputNumber
            min={1}
            disabled={!planValue}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentEntryModal;
