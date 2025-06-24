import express from 'express';
import { createApplication, getAllApplications, getApplicationsByStudent, getApplicationsByInstitute, updateApplicationStatus, deleteApplication } from '../controllers/application.controller.js';


const router = express.Router();

// Create a new application
router.post('/',  createApplication);

// Get all applications (admin)
router.get('/',  getAllApplications);

// Get applications by student
router.get('/student/:studentId',  getApplicationsByStudent);

// Get applications by institute
router.get('/institute/:instituteId',  getApplicationsByInstitute);

// Update application status
router.patch('/:id',  updateApplicationStatus);

// Delete application
router.delete('/:id',  deleteApplication);

export default router;