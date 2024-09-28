import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, message } from 'antd';
import { UserOutlined, FileAddOutlined, ToolOutlined, StarOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import CreateJob from '../components/CreateJob';
import ManageJobs from '../components/ManageJobs';
import EmployerProfile from '../components/EmployerProfile';

const { Content, Sider } = Layout;
const { Title } = Typography;

function EmployerDashboard() {
  const [selectedMenu, setSelectedMenu] = useState('profile');
  const { user } = useAuth();

  const renderContent = () => {
    switch (selectedMenu) {
      case 'profile':
        return <EmployerProfile />;
      case 'createJob':
        return <CreateJob />;
      case 'manageJobs':
        return <ManageJobs />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['profile']}
          style={{ height: '100%', borderRight: 0 }}
          onSelect={({ key }) => setSelectedMenu(key)}
        >
          <Menu.Item key="profile" icon={<UserOutlined />}>Profile</Menu.Item>
          <Menu.Item key="createJob" icon={<FileAddOutlined />}>Create Job</Menu.Item>
          <Menu.Item key="manageJobs" icon={<ToolOutlined />}>Manage Jobs</Menu.Item>
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
    </Layout>
  );
}

export default EmployerDashboard;