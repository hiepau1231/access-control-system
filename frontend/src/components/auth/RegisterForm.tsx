import { BaseAuthForm } from './BaseAuthForm';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { RegisterData } from '../../services/auth';
import { Rule } from 'antd/lib/form';

export const RegisterForm = () => {
  const { register, isLoading } = useAuth();

  const handleSubmit = async (values: RegisterData) => {
    try {
      await register(values);
    } catch (error) {
      console.error('Registration failed:', error);
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
      rules: [{ required: true, message: 'Please input your username!' }] as Rule[]
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
      rules: [{ required: true, message: 'Please input your password!' }] as Rule[]
    }
  ];

  return (
    <BaseAuthForm<RegisterData>
      onSubmit={handleSubmit}
      submitText="Register"
      fields={fields}
      loading={isLoading}
      extra={
        <div className="text-center">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      }
    />
  );
};

export default RegisterForm;