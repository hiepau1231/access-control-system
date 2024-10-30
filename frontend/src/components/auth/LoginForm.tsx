import React, { useState } from 'react';
import { BaseAuthForm } from './BaseAuthForm';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { LoginCredentials } from '../../services/auth';
import { message } from 'antd';

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: LoginCredentials) => {
    try {
      setError(null);
      await login(values);
      message.success('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const fields = [
    {
      name: 'username',
      label: 'Username',
      rules: [{ required: true, message: 'Please input your username!' }]
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      rules: [{ required: true, message: 'Please input your password!' }]
    }
  ];

  return (
    <>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <BaseAuthForm<LoginCredentials>
        onSubmit={handleSubmit}
        submitText="Login"
        fields={fields}
        loading={isLoading}
        extra={
          <div className="text-center">
            <Link to="/register">Don't have an account? Register</Link>
          </div>
        }
      />
    </>
  );
};
