import React, { useState } from 'react';
import { Form, Input, Button, Upload, InputNumber, Select, message, DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { TextArea } = Input;
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

function CreateJob() {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState(null);

  const onFinish = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key === 'deadline') {
        formData.append(key, values[key].toISOString());
      } else if (key !== 'image') {
        formData.append(key, values[key]);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('http://localhost:3000/api/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        message.success('Job created successfully');
        form.resetFields();
        setImageFile(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      message.error(error.message || 'Error creating job. Please try again.');
    }
  };

  const handleImageUpload = (info) => {
    if (info.file.status === 'done') {
      setImageFile(info.file.originFileObj);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div>
      <h2>Create a New Job</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Job Category" rules={[{ required: true }]}>
          <Select>
            {jobCategories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="description" label="Job Description" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="amount" label="Job Amount ($)" rules={[{ required: true, type: 'number', min: 0 }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true }]}>
          <Select>
            <Option value="cash">Cash</Option>
            <Option value="bankTransfer">Bank Transfer</Option>
            <Option value="mobileMoney">Mobile Money</Option>
          </Select>
        </Form.Item>
        <Form.Item name="estimatedTime" label="Estimated Time to Complete (hours)" rules={[{ required: true, type: 'number', min: 0 }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="location" label="Job Location" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="deadline" label="Application Deadline" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="image" label="Job Image">
          <Upload
            name="image"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            onChange={handleImageUpload}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Job
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateJob;