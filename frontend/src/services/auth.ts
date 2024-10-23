import api from './api';

export const logout = () => {
  localStorage.removeItem('token');
  // Redirect to login page
  window.location.href = '/login';
};
