import express from 'express';
import { getAnalytics } from '../controllers/analytics.controller.js';

const router = express.Router();

// Public route for analytics
router.get('/', getAnalytics);

export default router; 