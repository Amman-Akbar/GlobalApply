import express from 'express';
import {
  getAllStudents,
  getStudentById,
  getStudentByUserId,
  createStudent,
  updateStudent,
  deleteStudent,
  approveStudent,
  rejectStudent
} from '../controllers/student.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/me', authenticateToken, getStudentByUserId);
router.post('/',  createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

// Public routes
router.get('/', getAllStudents);
router.get('/:id', getStudentById);

// Admin routes
router.put('/:id/approve', approveStudent);
router.put('/:id/reject', rejectStudent);

export default router; 