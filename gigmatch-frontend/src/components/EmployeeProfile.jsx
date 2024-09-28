import React, { useState } from 'react';
import { Card, Button, Form, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

function EmployeeProfile({ profileData, setProfileData }) {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/api/employee/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfileData(updatedProfile);
        message.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        message.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Error updating profile');
    }
  };

  if (!profileData) return <div>Loading...</div>;

  return (
    <Card
      title="Employee Profile"
      extra={
        <Button 
          icon={<EditOutlined />} 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      }
    >
      {isEditing ? (
        <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={profileData}>
          <Form.Item name="skills" label="Skills" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Save Changes</Button>
          </Form.Item>
        </Form>
      ) : (
        <>
          <p><strong>Name:</strong> {profileData.username}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Skills:</strong> {profileData.skills}</p>
        </>
      )}
    </Card>
  );
}

export default EmployeeProfile;