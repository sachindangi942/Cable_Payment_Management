import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

const AddCustomerModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onAdd(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Add New Customer"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the customer name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mobile" name="mobile" rules={[
          { required: true, message: 'Please input the customer mobile number!' },
          { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' },
        ]}>
          <Input />
        </Form.Item>
        <Form.Item label="Cart Number" name="cartNumber" rules={[{ required: true, message: 'Please input the cart number!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Plan" name="plan" rules={[
          { required: true, message: 'Please input the plan number!' },
          { type: 'number', message: 'Plan must be a number!' }
        ]}>
          <InputNumber min={1} />
        </Form.Item>
     
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;
