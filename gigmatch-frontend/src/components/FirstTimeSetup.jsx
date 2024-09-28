import React from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const { TextArea } = Input;
const { Option } = Select;

const jobCategories = [
  'Agriculture',
  'Construction',
  'Domestic Work',
  'Transportation',
  'Retail',
  'Food Service',
  'Manufacturing',
  'Other',
];

function FirstTimeSetup({ onComplete }) {
  const { user } = useAuth();

  const onFinish = async (values) => {
    try {
        const response = await fetch('http://localhost:3000/api/employee/setup', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });

      if (response.ok) {
        message.success('Profile setup completed successfully');
        onComplete();
      } else {
        message.error('Failed to complete profile setup');
      }
    } catch (error) {
      console.error('Error during profile setup:', error);
      message.error('Error completing profile setup');
    }
  };

  return (
    <div>
      <h2>Welcome! Lets set up your profile</h2>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item name="skills" label="Skills" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="List your skills, separated by commas" />
        </Form.Item>
        <Form.Item name="strengths" label="Strengths" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="Describe your strengths" />
        </Form.Item>
        <Form.Item name="preferredCategories" label="Preferred Job Categories" rules={[{ required: true, type: 'array' }]}>
          <Select mode="multiple" placeholder="Select your preferred job categories">
            {jobCategories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Complete Setup
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default FirstTimeSetup;