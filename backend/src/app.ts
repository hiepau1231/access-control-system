import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { setupDatabase } from './config/database';
import authRoutes from './routes/authRoutes';

const app = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// Initialize database
setupDatabase().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);

// Add health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Add catch-all route for debugging
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    method: req.method,
    url: req.originalUrl,
    availableRoutes: ['/api/auth/login', '/api/auth/register', '/api/health']
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/auth/register');
  console.log('- GET /api/health');
});

export default app;