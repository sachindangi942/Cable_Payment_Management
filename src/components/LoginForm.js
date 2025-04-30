import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Alert, notification, Spin } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase Authentication se method import
import { auth } from './firebase'; // Firebase Authentication import
import { useNavigate } from 'react-router-dom'; // Navigation ke liye
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '../redux/fetures/LoadingSlice';

const LoginForm = () => {
  const { loading } = useSelector(state => state.loading)
  const [loginErr, setLoginErr] = useState("")
  const [form] = Form.useForm();
  const navigate = useNavigate();  // Navigation hook
  const dispatch = useDispatch();


  useEffect(() => {
    if (loginErr) {
      const timer = setTimeout(() => {
        setLoginErr("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // Cleanup
    }
  }, [loginErr]);

  const onFinish = async (values) => {
    try {
      // Firebase Authentication se email aur password check kar rahe hain
      dispatch(Loading(true));
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      // User ko logged in mark karte hain aur token store karte hain
      const expiryTime = Date.now() + 5 * 60 * 1000; // 15 min in ms
      localStorage.setItem("sessionExpiry", expiryTime);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userToken", user.accessToken); // Token bhi save kar rahe hain
      form.resetFields();
      dispatch(Loading(false));
      // Redirect to Dashboard after successful login
      navigate("/"); // Ya apni desired page route dena yahan
      notification.success({
        message: "success",
        description: "Login successfull",
        placement: "topRight",
        duration: 3
      });
    } catch (error) {
      dispatch(Loading(false));
      notification.error({
        message: "Login Field",
        description: "Try again later!",
        placement: "topRight",
        duration: 3, // seconds
      });
      setLoginErr(error.message)
      form.resetFields();
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      {loginErr && (
        <Alert
          message="Login Failed"
          description={loginErr}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}
      {
        loading ? (
          <div style={{ textAlign: 'center', marginTop: '180px' }}>
            <Spin tip="Login in...." size="large" fullscreen />
          </div>
        ) : (
          <Form
            className="shadow p-4"
            form={form}
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid Email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Log in
              </Button>
            </Form.Item>
            <div>
              <span>if you are not register ? </span>
              <Button type="link" onClick={() => navigate('/register')}>
                Click Here
              </Button>
            </div>
          </Form>
        )
      }

    </div>
  );
};

export default LoginForm;

