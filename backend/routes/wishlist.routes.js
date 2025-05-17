import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus,
  getAllWishlists,
  getInstituteWishlists
} from '../controllers/wishlist.controller.js';

const router = express.Router();

router.post('/add', addToWishlist);
router.delete('/remove', removeFromWishlist);
router.get('/user/:userId', getWishlist);
router.get('/check', checkWishlistStatus);
router.get('/', getAllWishlists);
router.get('/institute/:instituteId', getInstituteWishlists);

export default router; 