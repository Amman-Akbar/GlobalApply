import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus
} from '../controllers/wishlist.controller.js';

const router = express.Router();

router.post('/add', addToWishlist);
router.delete('/remove', removeFromWishlist);
router.get('/user/:userId', getWishlist);
router.get('/check', checkWishlistStatus);

export default router; 