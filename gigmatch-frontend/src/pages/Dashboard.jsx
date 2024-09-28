import React, { useState } from 'react';
import { Layout, Menu, Typography, List, Card, Button } from 'antd';
import { UserOutlined, FileSearchOutlined, DollarOutlined } from '@ant-design/icons';
import '../styles/Dashboard.css';

const { Content, Sider } = Layout;
const { Title } = Typography;

function Dashboard() {
  const [selectedMenu, setSelectedMenu] = useState('profile');

  const fakeGigs = [
    { id: 1, title: 'Farm Help Needed', description: 'Looking for help with harvest', pay: '$15/hour' },
    { id: 2, title: 'Construction Worker', description: 'Need experienced builder for house project', pay: '$20/hour' },
    { id: 3, title: 'Gardening Assistant', description: 'Help needed for large garden maintenance', pay: '$12/hour' },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'profile':
        return (
          <div>
            <Title level={3}>Your Profile</Title>
            <p>Username: JohnDoe</p>
            <p>Email: johndoe@example.com</p>
            <p>Phone: +1234567890</p>
            <Button type="primary">Edit Profile</Button>
          </div>
        );
      case 'gigs':
        return (
          <div>
            <Title level={3}>Available Gigs</Title>
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={fakeGigs}
              renderItem={(item) => (
                <List.Item>
                  <Card title={item.title}>
                    <p>{item.description}</p>
                    <p>Pay: {item.pay}</p>
                    <Button type="primary">Apply</Button>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        );
      case 'earnings':
        return (
          <div>
            <Title level={3}>Your Earnings</Title>
            <p>Total Earnings: $500</p>
            <p>Pending Payments: $100</p>
            <Button type="primary">Withdraw Funds</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout className="dashboard-layout">
      <Sider width={200} className="dashboard-sider">
        <Menu
          mode="inline"
          defaultSelectedKeys={['profile']}
          style={{ height: '100%', borderRight: 0 }}
          onSelect={({ key }) => setSelectedMenu(key)}
        >
          <Menu.Item key="profile" icon={<UserOutlined />}>Profile</Menu.Item>
          <Menu.Item key="gigs" icon={<FileSearchOutlined />}>Find Gigs</Menu.Item>
          <Menu.Item key="earnings" icon={<DollarOutlined />}>Earnings</Menu.Item>
        </Menu>
      </Sider>
      <Content className="dashboard-content">
        {renderContent()}
      </Content>
    </Layout>
  );
}

export default Dashboard;