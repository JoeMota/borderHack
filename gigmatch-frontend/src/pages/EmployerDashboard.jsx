import React, { useState } from 'react';
import { Layout, Menu, Typography, List, Card, Button, Modal, Form, Input, InputNumber } from 'antd';
import { UserOutlined, FileAddOutlined, TeamOutlined } from '@ant-design/icons';
import '../styles/EmployerDashboard.css';

const { Content, Sider } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

function EmployerDashboard() {
  const [selectedMenu, setSelectedMenu] = useState('profile');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fakeGigs = [
    { id: 1, title: 'Farm Help Needed', description: 'Looking for help with harvest', pay: '$15/hour', applicants: 3 },
    { id: 2, title: 'Construction Worker', description: 'Need experienced builder for house project', pay: '$20/hour', applicants: 5 },
    { id: 3, title: 'Gardening Assistant', description: 'Help needed for large garden maintenance', pay: '$12/hour', applicants: 2 },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    // Here you would typically send the new gig data to your backend
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'profile':
        return (
          <div>
            <Title level={3}>Your Profile</Title>
            <p>Company: Acme Inc.</p>
            <p>Email: employer@acme.com</p>
            <p>Phone: +1234567890</p>
            <Button type="primary">Edit Profile</Button>
          </div>
        );
      case 'postGig':
        return (
          <div>
            <Title level={3}>Post a New Gig</Title>
            <Button type="primary" onClick={showModal}>Create New Gig</Button>
            <Modal title="Create New Gig" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              <Form layout="vertical">
                <Form.Item name="title" label="Gig Title" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="pay" label="Pay Rate ($/hour)" rules={[{ required: true }]}>
                  <InputNumber min={1} />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        );
      case 'postedGigs':
        return (
          <div>
            <Title level={3}>Your Posted Gigs</Title>
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={fakeGigs}
              renderItem={(item) => (
                <List.Item>
                  <Card title={item.title}>
                    <p>{item.description}</p>
                    <p>Pay: {item.pay}</p>
                    <p>Applicants: {item.applicants}</p>
                    <Button type="primary">View Applicants</Button>
                  </Card>
                </List.Item>
              )}
            />
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
          <Menu.Item key="postGig" icon={<FileAddOutlined />}>Post a Gig</Menu.Item>
          <Menu.Item key="postedGigs" icon={<TeamOutlined />}>Posted Gigs</Menu.Item>
        </Menu>
      </Sider>
      <Content className="dashboard-content">
        {renderContent()}
      </Content>
    </Layout>
  );
}

export default EmployerDashboard;