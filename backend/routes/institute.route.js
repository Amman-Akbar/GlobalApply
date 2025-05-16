import express from 'express';
import {
  getAllInstitutes,
  getInstituteById,
  addInstitute,
  updateInstitute,
  deleteInstitute,
  getFeaturedInstitutes,
  getTrendingInstitutes,
  getLatestListings,
  getActiveInstitutes,
  approveInstitute,
  rejectInstitute,
  getInstituteByUserId
} from '../controllers/institute.controller.js';

const router = express.Router();

// Special routes
router.get('/featured', getFeaturedInstitutes);
router.get('/trending', getTrendingInstitutes);
router.get('/latest-listings', getLatestListings);
router.get('/active', getActiveInstitutes);

// General routes
router.get('/', getAllInstitutes);
router.get('/:id', getInstituteById);
router.get('/user/:userId', getInstituteByUserId);
router.post('/', addInstitute);
router.put('/:id', updateInstitute);
router.delete('/:id', deleteInstitute);

// Approval routes
router.put('/:id/approve', approveInstitute);
router.put('/:id/reject', rejectInstitute);

export default router;