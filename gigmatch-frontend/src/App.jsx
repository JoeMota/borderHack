import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout">
        <AppHeader />
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <div className="site-layout-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </Content>
        <AppFooter />
      </Layout>
    </Router>
  );
}

export default App;