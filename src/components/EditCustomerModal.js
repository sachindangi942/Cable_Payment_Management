import React, { useEffect } from 'react';
import { Modal, Form, Input} from 'antd';

const EditCustomerModal = ({ visible, onCancel, onUpdate, customer }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (customer) {
      form.setFieldsValue(customer);
    }
  }, [customer, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onUpdate({ ...customer, ...values });
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Edit Customer"
      open={visible}
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mobile" name="mobile" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item label="Cart Number" name="cartNumber" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Plan" name="plan" rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCustomerModal;
