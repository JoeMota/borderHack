import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined, LoginOutlined, PlusCircleOutlined } from '@ant-design/icons';
import '../styles/Header.css';

const { Header } = Layout;

function AppHeader() {
  return (
    <Header className="header">
      <div className="logo">
        <Link to="/">GigMatch</Link>
      </div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<PlusCircleOutlined />}>
          <Link to="/dashboard">Find Gigs</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          <Link to="/register">Register</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<LoginOutlined />}>
          <Link to="/login">Login</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default AppHeader;