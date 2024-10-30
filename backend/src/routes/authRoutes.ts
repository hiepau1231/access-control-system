import express from 'express';
import { login, register } from '../controllers/AuthController';

const router = express.Router();

// Đổi từ /auth/login thành /login vì prefix /api/auth đã được thêm trong app.ts
router.post('/login', login);
router.post('/register', register);

export default router;
