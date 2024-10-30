import { BaseAuthForm } from './BaseAuthForm';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { LoginCredentials } from '../../services/auth';

export const LoginForm = () => {
  const { login, isLoading } = useAuth();

  const handleSubmit = async (values: LoginCredentials) => {
    try {
      await login(values);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
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
  );
};