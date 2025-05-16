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

const router = express.Router();

// Public routes
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.put('/:id/approve', approveStudent);
router.put('/:id/reject', rejectStudent);

export default router; 