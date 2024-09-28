import React from 'react';
import { Typography, Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph } = Typography;

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <Title>Welcome to GigMatch</Title>
      <Paragraph>
        Connect with opportunities in manual labor and agricultural sectors. 
        Find gigs or post jobs easily and securely.
      </Paragraph>
      <Space>
        {user ? (
          <Button type="primary" size="large">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <>
            <Button type="primary" size="large">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button size="large">
              <Link to="/login">Login</Link>
            </Button>
          </>
        )}
      </Space>
    </div>
  );
}

export default Home;