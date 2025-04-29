// import React from 'react';
// import { Form, Input, Button } from 'antd';
// import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
// import { addDoc, collection } from 'firebase/firestore';
// import { db } from './firebase';

// const RegistrationForm = () => {
//   const [form] = Form.useForm();

//   const onFinish =  async(values) => {
//     const {confirm,...dataToSave} = values
//     try {
//       await addDoc(collection(db,"users"),dataToSave);
//       alert("registration successfull");
//       form.resetFields()
//     } catch (error) {
//       console.log(error)
//     }
//     // console.log('Form Values:', values);
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: '50px auto' }}>
//       <h2 style={{ textAlign: 'center' }}>Registration Form</h2>
//       <Form
//         form={form}
//         name="register"
//         onFinish={onFinish}
//         scrollToFirstError
//         layout="vertical"
//       >
//         <Form.Item
//           name="name"
//           label="Name"
//           rules={[{ required: true, message: 'Please input your Name!' }]}
//         >
//           <Input prefix={<UserOutlined />} placeholder="Enter your name" />
//         </Form.Item>

//         <Form.Item
//           name="email"
//           label="Email"
//           rules={[
//             { type: 'email', message: 'The input is not valid E-mail!' },
//             { required: true, message: 'Please input your E-mail!' },
//           ]}
//         >
//           <Input prefix={<MailOutlined />} placeholder="Enter your email" />
//         </Form.Item>

//         <Form.Item
//           name="phone"
//           label="Phone Number"
//           rules={[
//             { required: true, message: 'Please input your phone number!' },
//             { min: 10, message: 'Phone number must be at least 10 digits' }
//           ]}
//         >
//           <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
//         </Form.Item>

//         <Form.Item
//           name="password"
//           label="Password"
//           rules={[
//             { required: true, message: 'Please input your password!' },
//             { min: 6, message: 'Password must be minimum 6 characters.' },
//           ]}
//           hasFeedback
//         >
//           <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
//         </Form.Item>

//         <Form.Item
//           name="confirm"
//           label="Confirm Password"
//           dependencies={['password']}
//           hasFeedback
//           rules={[
//             { required: true, message: 'Please confirm your password!' },
//             ({ getFieldValue }) => ({
//               validator(_, value) {
//                 if (!value || getFieldValue('password') === value) {
//                   return Promise.resolve();
//                 }
//                 return Promise.reject('The two passwords do not match!');
//               },
//             }),
//           ]}
//         >
//           <Input.Password prefix={<LockOutlined />} placeholder="Confirm your password" />
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" block>
//             Register
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default RegistrationForm;



import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Firebase Authentication import
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // Firebase Authentication me user register karna
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;
      notification.success({
        message: "success",
        description: "Registration successful!",
        placement: "topRight",
        duration:3
      })
      // You can store token or user details if needed in localStorage
      // localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("userToken", user.accessToken);

      form.resetFields();
      // Redirect to Dashboard
      navigate("/login") // Modify this if you want to use routing
    } catch (error) {
      console.error(error);
      notification.error({
        message: "error",
        description: "Registration Field",
        placement: "topRight",
        duration:3
      })
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }} className='shadow p-4' >
      <Form form={form} name="register" onFinish={onFinish} scrollToFirstError layout="vertical">
        <Form.Item name="name"  rules={[{ required: true, message: 'Please input your Name!' }]}>
          <Input prefix={<UserOutlined />} placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[{ type: 'email', message: 'The input is not valid E-mail!' }, { required: true, message: 'Please input your E-mail!' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[{ required: true, message: 'Please input your phone number!' }, { min: 10, message: 'Phone number must be at least 10 digits' }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }, { min: 6, message: 'Password must be minimum 6 characters.' }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
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
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
        <div>
          <span>If you're already registered? </span>
          <Button type="link" onClick={() => navigate('/login')}>
            Click Here
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RegistrationForm;
