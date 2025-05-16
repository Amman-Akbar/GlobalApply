import express from 'express';
import { signup, login, token, registerInstitute, registerStudent } from '../controllers/auth.controller.js';

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', token);
router.post('/register-institute', registerInstitute);
router.post('/register-student', registerStudent);

export default router; 