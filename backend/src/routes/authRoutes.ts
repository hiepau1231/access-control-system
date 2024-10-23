import express from 'express';
import * as AuthController from '../controllers/AuthController';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/enable-2fa', AuthController.enable2FA);
router.post('/verify-2fa', AuthController.verify2FA);
router.post('/disable-2fa', AuthController.disable2FA);

export default router;
