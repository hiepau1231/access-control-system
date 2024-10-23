import React from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/antd.min.css'; // Thêm dòng này
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
