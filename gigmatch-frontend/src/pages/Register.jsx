import React from 'react';
import { Form, Input, Button, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import '../styles/Register.css';

const { Title } = Typography;
const { Option } = Select;

function Register() {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    // Here you would typically send a request to your backend to register the user
  };

  return (
    <div className="register-container">
      <Title level={2}>Register for GigMatch</Title>
      <Form
        name="register"
        className="register-form"
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your Email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="phone"
          rules={[{ required: true, message: 'Please input your Phone number!' }]}
        >
          <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone" />
        </Form.Item>
        <Form.Item
          name="userType"
          rules={[{ required: true, message: 'Please select a user type!' }]}
        >
          <Select placeholder="Select user type">
            <Option value="worker">Worker</Option>
            <Option value="employer">Employer</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="register-form-button">
            Register
          </Button>
          Already have an account? <a href="/login">Login now!</a>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Register;