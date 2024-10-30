import React from 'react';
import { Form, Input, Button } from 'antd';
import { Rule } from 'antd/lib/form';

interface BaseAuthFormProps<T> {
  onSubmit: (values: T) => Promise<void>;
  submitText: string;
  fields: {
    name: string;
    label: string;
    rules: Rule[];
    type?: string;
  }[];
  loading?: boolean;
  extra?: React.ReactNode;
}

export function BaseAuthForm<T>({
  onSubmit,
  submitText,
  fields,
  loading = false,
  extra
}: BaseAuthFormProps<T>) {
  const [form] = Form.useForm();

  const handleSubmit = async (values: T) => {
    try {
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      // Error handling will be done by parent component
      throw error;
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="w-full max-w-md"
    >
      {fields.map(({ name, label, rules, type = 'text' }) => (
        <Form.Item key={name} name={name} label={label} rules={rules}>
          <Input type={type} />
        </Form.Item>
      ))}
      
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {submitText}
        </Button>
      </Form.Item>

      {extra}
    </Form>
  );
}