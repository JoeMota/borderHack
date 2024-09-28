import React, { useState, useEffect } from 'react';
import { List, Card, Tag, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';

function PendingJobs() {
  const [pendingJobs, setPendingJobs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employee/pending-jobs', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPendingJobs(data);
      } else {
        message.error('Failed to fetch pending jobs');
      }
    } catch (error) {
      console.error('Error fetching pending jobs:', error);
      message.error('Error fetching pending jobs');
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
      <h2>Pending Job Requests</h2>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={pendingJobs}
        renderItem={(job) => (
          <List.Item>
            <Card
              title={job.title}
              extra={<Tag color={getStatusColor(job.status)}>{job.status}</Tag>}
            >
              <p><strong>Category:</strong> {job.category}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Amount:</strong> ${job.amount}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Estimated Time:</strong> {job.estimatedTime} hours</p>
              <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
              <p><strong>Requested On:</strong> {new Date(job.requestDate).toLocaleDateString()}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default PendingJobs;