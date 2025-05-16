import express from 'express';
import { 
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  toggleSubscriptionStatus,
  assignSubscription,
  removeSubscription
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

export default router; 