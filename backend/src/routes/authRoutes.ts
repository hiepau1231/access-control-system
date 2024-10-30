import express from 'express';
import { login, register } from '../controllers/authController';

const router = express.Router();

// Route POST cho login thực tế
router.post('/login', login);
router.post('/register', register);

// Route GET để test
router.get('/login', (req, res) => {
  res.json({ message: 'Login endpoint is working. Please use POST method to login.' });
});

export default router;
