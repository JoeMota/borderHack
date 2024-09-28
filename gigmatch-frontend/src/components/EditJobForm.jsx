import React from 'react';
import { Form, Input, Button, InputNumber, Select, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

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

function EditJobForm({ job, onUpdate }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const updatedJob = {
      ...job,
      ...values,
      deadline: values.deadline.toISOString(),
    };
    onUpdate(updatedJob);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={{
        ...job,
        deadline: job.deadline ? new Date(job.deadline) : null,
      }}
      layout="vertical"
    >
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
      <Form.Item
        name="image"
        label="Job Image"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          name="image"
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Job
        </Button>
      </Form.Item>
    </Form>
  );
}

export default EditJobForm;