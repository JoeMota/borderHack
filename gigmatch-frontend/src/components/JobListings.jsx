// src/components/JobListings.jsx
import React, { useState, useEffect } from 'react';
import { List, Card, Button, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';

function JobListings() {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/jobs', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        message.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      message.error('Error fetching jobs');
    }
  };

  const handleApply = async (jobId) => {
    try {
      const response = await fetch('http://localhost:3000/api/employee/apply-job', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });
      if (response.ok) {
        message.success('Job application submitted successfully');
        fetchJobs(); // Refresh the job list
      } else {
        message.error('Failed to submit job application');
      }
    } catch (error) {
      console.error('Error submitting job application:', error);
      message.error('Error submitting job application');
    }
  };

  return (
    <div>
      <h2>Available Jobs</h2>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={jobs}
        renderItem={(job) => (
          <List.Item>
            <Card
              title={job.title}
              extra={<Button onClick={() => handleApply(job.id)} type="primary">Apply</Button>}
            >
              <p><strong>Category:</strong> {job.category}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Amount:</strong> ${job.amount}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default JobListings;