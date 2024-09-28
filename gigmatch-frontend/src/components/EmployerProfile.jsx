import React, { useState, useEffect } from 'react';
import { Card, Rate, List, Typography, Statistic, Row, Col, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

function EmployerProfile() {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
    fetchReviews();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employer/profile', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      message.error('Failed to load profile. Please try again later.');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employer/reviews', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        throw new Error('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      message.error('Failed to load reviews. Please try again later.');
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title level={2}>Employer Profile</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic title="Overall Rating" value={profile.rating} prefix={<Rate disabled defaultValue={profile.rating} />} />
            <Statistic title="Total Jobs Posted" value={profile.totalJobs} />
            <Statistic title="Completed Jobs" value={profile.completedJobs || 0} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Recent Reviews">
            <List
              itemLayout="horizontal"
              dataSource={reviews}
              renderItem={(review) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Rate disabled defaultValue={review.rating} />}
                    description={review.comment}
                  />
                  <Text type="secondary">{review.date}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default EmployerProfile;