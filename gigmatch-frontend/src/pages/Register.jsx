import React from 'react';
import { Form, Input, Button, Typography, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Register.css';

const { Title } = Typography;
const { Option } = Select;

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Registration successful!');
        // Automatically log in the user after successful registration
        const loginResponse = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: values.username,
            password: values.password,
          }),
        });

        if (loginResponse.ok) {
          const data = await loginResponse.json();
          login(data.token);
          navigate('/dashboard');
        }
      } else {
        message.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('An error occurred during registration');
    }
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
            <Option value="employer">Employer</Option>
            <Option value="employee">Employee</Option>
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