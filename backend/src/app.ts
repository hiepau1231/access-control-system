import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import permissionRoutes from './routes/permissionRoutes';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Khởi tạo database
initializeDatabase().then(() => {
  console.log('Database initialized');
}).catch((error) => {
  console.error('Error initializing database:', error);
});

// Sử dụng routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
