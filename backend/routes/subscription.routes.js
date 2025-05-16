import express from 'express';
import { 
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  toggleSubscriptionStatus,
  assignSubscription,
  removeSubscription,
  approveSubscription,
  rejectSubscription
} from '../controllers/subscription.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllSubscriptions);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);
router.patch('/:id/toggle-status', toggleSubscriptionStatus);
router.post('/assign', assignSubscription);
router.post('/remove', removeSubscription);
router.post('/approve', approveSubscription);
router.post('/reject', rejectSubscription);

export default router; 