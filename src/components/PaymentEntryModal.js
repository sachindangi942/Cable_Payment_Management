// import React from 'react';
// import { Modal, Form, InputNumber, Select, DatePicker } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { addPayment } from '../redux/fetures/PaymentSlice';

// const PaymentEntryModal = ({ visible, onAdd, onCancel }) => {
//   const dispatch = useDispatch();
//   const { customarData } = useSelector(state => state.customare)
//   const [form] = Form.useForm();

//   const handleAdd = () => {
//     form.validateFields().then((values) => {
//       onAdd(values);
//       dispatch(addPayment(values));
//       form.resetFields();
//     });
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
//         <Form.Item label="Customer" name="customer" rules={[{ required: true }]}>
//           <Select>
//             {customarData.map((customar) => (
//               <Select.Option key={customar.mobile} value={customar.mobile} >
//                 {customar.name}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item label="Paid Amount (₹)" name="paidAmount" rules={[{ required: true }]}>
//           <InputNumber min={0} style={{ width: '100%' }} />
//         </Form.Item>
//         <Form.Item label="Date" name="date" rules={[{ required: true }]}>
//           <DatePicker style={{ width: '100%' }} />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default PaymentEntryModal;




import React from 'react';
import { Modal, Form, InputNumber, Select, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addPayment } from '../redux/fetures/PaymentSlice';
import dayjs from 'dayjs';

const PaymentEntryModal = ({ visible, onAdd, onCancel }) => {
  const dispatch = useDispatch();
  const { customarData } = useSelector(state => state.customare);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        date: dayjs().format('YYYY-MM-DD') // Automatically current date
      };
      onAdd(formattedValues); 
      dispatch(addPayment(formattedValues)); 
      form.resetFields();
    });
  };

  const handleCartNumberChange = (cartNumber) => {
    const selectedCustomer = customarData.find(cust => cust.cartNumber === cartNumber);
    if (selectedCustomer) {
      form.setFieldsValue({
        name: selectedCustomer.name,
        plan: selectedCustomer.plan
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
            {customarData.map((customar) => (
              <Select.Option key={customar.cartNumber} value={customar.cartNumber}>
                {customar.cartNumber}
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

        <Form.Item label="Paid Amount (₹)" name="paidAmount" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default PaymentEntryModal;
