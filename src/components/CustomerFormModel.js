import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, DatePicker } from 'antd';
import dayjs from 'dayjs';

const CustomerFormModal = ({ onSubmit, initialValues }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (initialValues) {
            const updatedInitialValues = {
                ...initialValues,
                date: initialValues.date ? dayjs(initialValues.date) : null
            };
            form.setFieldsValue(updatedInitialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);


    const onFinish = (values) => {
        console.log("onfinish date 1", values.date)
        values.date = values.date ? values.date.toISOString() : null;
        console.log("onfinish date 2", values.date)
        onSubmit(values);
        form.resetFields();
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            // initialValues={initialValues}
        >
            <Form.Item label="Date" name="date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter Name' }]}
            >
                <Input placeholder="Enter Customer Name" />
            </Form.Item>

            <Form.Item
                label="Mobile"
                name="mobile"
                rules={[
                    { required: true, message: 'Please enter Mobile Number' },
                    { pattern: /^[0-9]{10}$/, message: 'Enter valid 10-digit Mobile Number' },
                ]}
            >
                <Input placeholder="Enter Mobile Number" disabled={!!initialValues} />
            </Form.Item>

            <Form.Item
                label="Cart Number"
                name="cartNumber"
                rules={[{ required: true, message: 'Please enter Cart Number' }]}
            >
                <Input placeholder="Enter Cart Number" />
            </Form.Item>

            <Form.Item
                label="Plan"
                name="plan"
                rules={[{ required: true, message: 'Please enter Plan Amount' }]}
            >
                <InputNumber
                    placeholder="Enter Plan Amount"
                    style={{ width: '100%' }}
                    min={0}
                />
            </Form.Item>

            <Form.Item
                label="Paid Amount"
                name="paidAmount"
                initialValue={0}
            >
                <InputNumber
                    placeholder="Enter Paid Amount (optional)"
                    style={{ width: '100%' }}
                    min={0}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    {initialValues ? 'Update Customer' : 'Add Customer'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CustomerFormModal;
