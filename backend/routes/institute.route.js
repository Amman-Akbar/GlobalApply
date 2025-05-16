import express from 'express';
import { addInstitute, deleteInstitute, getAllInstitutes,getActiveInstitutes, getTrendingInstitutes,getInstituteById, getInstituteByUserId,getLatestListings, updateInstitute,getFeaturedInstitutes, approveInstitute, rejectInstitute } from '../controllers/institute.controller.js';

const router = express.Router();

// Specific routes first
router.get('/featured', getFeaturedInstitutes);
router.get('/active', getActiveInstitutes);
router.get('/trending', getTrendingInstitutes);
router.get('/latest-listings', getLatestListings);
router.get('/user/:userId', getInstituteByUserId);

// Parameterized routes last
router.get('/', getAllInstitutes);
router.get('/:id', getInstituteById);
router.post('/', addInstitute);
router.put('/:id', updateInstitute);
router.delete('/:id', deleteInstitute);
router.put('/:id/approve', approveInstitute);
router.put('/:id/reject', rejectInstitute);

export default router;