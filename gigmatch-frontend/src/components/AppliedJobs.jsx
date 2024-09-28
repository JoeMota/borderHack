// src/components/AppliedJobs.jsx
import React, { useState, useEffect } from 'react';
import { List, Card, Tag, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';

function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employee/applied-jobs', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAppliedJobs(data);
      } else {
        message.error('Failed to fetch applied jobs');
      }
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      message.error('Error fetching applied jobs');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <div>
      <h2>Applied Jobs</h2>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={appliedJobs}
        renderItem={(job) => (
          <List.Item>
            <Card
              title={job.title}
              extra={<Tag color={getStatusColor(job.status)}>{job.status}</Tag>}
            >
              <p><strong>Category:</strong> {job.category}</p>
              <p><strong>Amount:</strong> ${job.amount}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Applied On:</strong> {new Date(job.appliedDate).toLocaleDateString()}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default AppliedJobs;