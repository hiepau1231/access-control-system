import { BaseAuthForm } from './BaseAuthForm';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { RegisterData } from '../../services/auth';
import { Rule } from 'antd/lib/form';
import { message } from 'antd';

export const RegisterForm = () => {
  const { register, isLoading } = useAuth();

  const handleSubmit = async (values: RegisterData & { confirmPassword: string }) => {
    try {
      if (values.password !== values.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = values;
      await register(registerData);
      message.success('Registration successful! Redirecting to dashboard...');
    } catch (error) {
      console.error('Registration failed:', error);
      message.error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      throw error;
    }
  };

  const fields: Array<{
    name: string;
    label: string;
    rules: Rule[];
    type?: string;
  }> = [
    {
      name: 'username',
      label: 'Username',
      rules: [
        { required: true, message: 'Please input your username!' },
        { min: 3, message: 'Username must be at least 3 characters!' },
        { max: 20, message: 'Username cannot be longer than 20 characters!' },
        { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Username can only contain letters, numbers, underscores and hyphens!' }
      ] as Rule[]
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      rules: [
        { required: true, message: 'Please input your email!' },
        { type: 'email', message: 'Please enter a valid email!' }
      ] as Rule[]
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      rules: [
        { required: true, message: 'Please input your password!' },
        { min: 8, message: 'Password must be at least 8 characters!' },
        { 
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character!'
        }
      ] as Rule[]
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      rules: [
        { required: true, message: 'Please confirm your password!' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords do not match!'));
          },
        })
      ] as Rule[]
    }
  ];

  return (
    <BaseAuthForm<RegisterData & { confirmPassword: string }>
      onSubmit={handleSubmit}
      submitText="Register"
      fields={fields}
      loading={isLoading}
      extra={
        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Already have an account? Login
          </Link>
        </div>
      }
    />
  );
};

export default RegisterForm;