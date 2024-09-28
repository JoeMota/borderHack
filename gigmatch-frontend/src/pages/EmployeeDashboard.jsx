import React, { useState, useEffect } from 'react';
import { Layout, Menu, Modal, Form, Input, Button, message } from 'antd';
import { UserOutlined, FileSearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import EmployeeProfile from '../components/EmployeeProfile';
import JobListings from '../components/JobListings';
import AppliedJobs from '../components/AppliedJobs';

const { Content, Sider } = Layout;

function EmployeeDashboard() {
  const [selectedMenu, setSelectedMenu] = useState('profile');
  const [isFirstTimeModalVisible, setIsFirstTimeModalVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const { user, updateUser } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    checkFirstTimeLogin();
  }, []);

  const checkFirstTimeLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employee/profile', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        if (!data.hasCompletedSetup) {
          setIsFirstTimeModalVisible(true);
        }
      }
    } catch (error) {
      console.error('Error checking first time login:', error);
    }
  };

  const handleFirstTimeSetup = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/api/employee/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          name: user.username // Use username as the name
        }),
      });

      if (response.ok) {
        const updatedProfileData = await response.json();
        setProfileData(updatedProfileData.user);
        message.success('Profile setup completed successfully');
        setIsFirstTimeModalVisible(false);
        updateUser({ ...user, hasCompletedSetup: true });
      } else {
        message.error('Failed to complete profile setup');
      }
    } catch (error) {
      console.error('Error during profile setup:', error);
      message.error('Error completing profile setup');
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'profile':
        return <EmployeeProfile profileData={profileData} setProfileData={setProfileData} />;
      case 'jobListings':
        return <JobListings />;
      case 'appliedJobs':
        return <AppliedJobs />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <Menu
          mode="inline"
          defaultSelectedKeys={['profile']}
          style={{ height: '100%', borderRight: 0 }}
          onSelect={({ key }) => setSelectedMenu(key)}
        >
          <Menu.Item key="profile" icon={<UserOutlined />}>Profile</Menu.Item>
          <Menu.Item key="jobListings" icon={<FileSearchOutlined />}>Job Listings</Menu.Item>
          <Menu.Item key="appliedJobs" icon={<ClockCircleOutlined />}>Applied Jobs</Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: '#fff',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
      <Modal
        title="Complete Your Profile"
        visible={isFirstTimeModalVisible}
        footer={null}
        closable={false}
      >
        <Form form={form} onFinish={handleFirstTimeSetup} layout="vertical">
          <Form.Item name="skills" label="Skills (comma-separated)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Complete Setup
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default EmployeeDashboard;