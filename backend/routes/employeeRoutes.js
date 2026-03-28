import express from 'express';
import { mockAuth, requireRole } from '../middlewares/mockAuth.js';
import { getApplicants, updateApplicationStatus, getAllPostedJobs } from '../controllers/employeeController.js';

const router = express.Router();

router.use(mockAuth);
router.use(requireRole('employee'));

router.get('/jobs', getAllPostedJobs);
router.get('/jobs/:jobId/applicants', getApplicants);
router.patch('/applications/:applicationId/status', updateApplicationStatus);

export default router;
