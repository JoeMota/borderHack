import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

function AppFooter() {
  return (
    <Footer style={{ textAlign: 'center' }}>
      GigMatch ©{new Date().getFullYear()} Created by Your Company
    </Footer>
  );
}

export default AppFooter;