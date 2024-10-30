import express from 'express';
import cors from 'cors';
import { setupDatabase } from './config/database';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // hoặc port mà frontend đang chạy
  credentials: true
}));
app.use(express.json());

// Initialize database
setupDatabase().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;