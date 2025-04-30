import React, { useState } from 'react';
import { Input, Button, Form, notification } from 'antd';
import { LockOutlined } from "@ant-design/icons"
import { auth } from './firebase';
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePasswordChange = async (values) => {
        const user = auth.currentUser;

        if (!user) {
            notification.error({
                message: 'Error',
                description: 'User not logged in!',
            });
            return;
        }

        const { oldPassword, newPassword } = values;
        const credential = EmailAuthProvider.credential(
            user.email,
            oldPassword
        );

        try {
            setLoading(true);

            // Step 1: Re-authenticate
            await reauthenticateWithCredential(user, credential);

            // Step 2: Update password
            await updatePassword(user, newPassword);
            navigate("/login")
            notification.success({
                message: 'Success',
                description: 'Password updated successfully!',
                duration: 3,
                placement: "topRight"
            });

            form.resetFields();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message,
                duration:3,
                placement:"topRight"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="shadow p-4 mx-auto my-5 w-50">
            <Form form={form} layout="vertical" onFinish={handlePasswordChange}>
                <Form.Item
                    label="Old Password"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Please enter your old password' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Enter old password" />
                </Form.Item>

                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                        { required: true, message: 'Please enter a new password' },
                        { min: 6, message: 'Password must be at least 6 characters' },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
                </Form.Item>
                <Form.Item
                    label="confirm Password"
                    name="confirm"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('The two passwords do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirm your password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangePassword;
