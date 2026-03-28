import express from 'express';
import { mockAuth } from '../middlewares/mockAuth.js';
import {
  getStudentProfile,
  updateStudentProfile,
  addSkill,
  removeSkill
} from '../controllers/profileController.js';

const router = express.Router();

router.use(mockAuth);

router.get('/student', getStudentProfile);
router.put('/student', updateStudentProfile);
router.post('/student/skills', addSkill);
router.delete('/student/skills', removeSkill);

export default router;
