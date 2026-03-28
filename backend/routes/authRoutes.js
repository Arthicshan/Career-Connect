import express from 'express';
import { login, logout, register, getCurrentUser } from '../controllers/authController.js';
import { mockAuth } from '../middlewares/mockAuth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.get('/me', mockAuth, getCurrentUser);

export default router;
