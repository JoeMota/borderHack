import React, { useState, useEffect } from 'react';
import { List, Card, Button, Modal, Input, Select, message, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import EditJobForm from './EditJobForm';

const { Option } = Select;

const jobCategories = [
  'Agriculture',
  'Construction',
  'Domestic Work',
  'Transportation',
  'Retail',
  'Food Service',
  'Manufacturing',
  'Other',
];

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, filterCategory]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employer/jobs', {
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

  const filterJobs = () => {
    let filtered = jobs;
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterCategory) {
      filtered = filtered.filter(job => job.category === filterCategory);
    }
    setFilteredJobs(filtered);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setIsModalVisible(true);
  };

  const handleDelete = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        message.success('Job deleted successfully');
        fetchJobs();
      } else {
        message.error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      message.error('Error deleting job');
    }
  };

  const handleUpdateJob = async (updatedJob) => {
    const formData = new FormData();
    Object.keys(updatedJob).forEach(key => {
      if (key === 'deadline') {
        formData.append(key, updatedJob[key].toISOString());
      } else if (key !== 'image') {
        formData.append(key, updatedJob[key]);
      }
    });
    if (updatedJob.image && updatedJob.image.file) {
      formData.append('image', updatedJob.image.file);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/jobs/${updatedJob.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formData,
      });
      if (response.ok) {
        message.success('Job updated successfully');
        setIsModalVisible(false);
        fetchJobs();
      } else {
        message.error('Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      message.error('Error updating job');
    }
  };

  return (
    <div>
      <h2>Manage Jobs</h2>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search jobs"
          prefix={<SearchOutlined />}
          style={{ width: 200, marginRight: 8 }}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Filter by category"
          onChange={value => setFilterCategory(value)}
          allowClear
        >
          {jobCategories.map(category => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>
      </div>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={filteredJobs}
        renderItem={(job) => (
          <List.Item>
            <Card
              title={job.title}
              cover={job.image && <img alt={job.title} src={job.image} />}
              actions={[
                <Button icon={<EditOutlined />} onClick={() => handleEdit(job)}>Edit</Button>,
                <Button icon={<DeleteOutlined />} onClick={() => handleDelete(job.id)} danger>Delete</Button>
              ]}
            >
              <p><strong>Category:</strong> {job.category}</p>
              <p><strong>Amount:</strong> ${job.amount}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Estimated Time:</strong> {job.estimatedTime} hours</p>
              <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title="Edit Job"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {editingJob && (
          <EditJobForm job={editingJob} onUpdate={handleUpdateJob} />
        )}
      </Modal>
    </div>
  );
}

export default ManageJobs;