import express from 'express';
import { signup, token,login,registerInstitute } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup)
router.get('/me', token);
router.post('/login',login)
router.post('/register-institute', registerInstitute);


export default router;