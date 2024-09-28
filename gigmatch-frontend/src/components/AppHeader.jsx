// src/components/AppHeader.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { HomeOutlined, UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const { Header } = Layout;

function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Header className="header">
      <div className="logo">
        <Link to="/">GigMatch</Link>
      </div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        {user ? (
          <>
            <Menu.Item key="2" icon={<UserOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Button 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
              style={{ marginLeft: 'auto' }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Menu.Item key="3" icon={<LoginOutlined />}>
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              <Link to="/register">Register</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </Header>
  );
}

export default AppHeader;