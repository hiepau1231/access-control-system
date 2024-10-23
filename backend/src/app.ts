import express from 'express';
import cors from 'cors';
import path from 'path';
import { sequelize } from './config/database';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import permissionRoutes from './routes/permissionRoutes';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Sync database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized');
});

// Sử dụng routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
