import express from 'express';
import { mockAuth, requireRole } from '../middlewares/mockAuth.js';
import { 
  getJobs, 
  getJobById, 
  getRecommendedJobs, 
  getMatchingJobs,
  getCareerPath 
} from '../controllers/matchingController.js';
import {
  bookmarkJob,
  removeBookmark,
  getBookmarks,
  applyForJob,
  getApplications
} from '../controllers/applicationController.js';

const router = express.Router();

router.use(mockAuth);

router.get('/jobs', getJobs);
router.get('/jobs/recommended', getRecommendedJobs);
router.get('/jobs/matching', getMatchingJobs);
router.get('/jobs/:id', getJobById);

router.post('/jobs/:jobId/apply', requireRole('student'), applyForJob);
router.post('/jobs/:jobId/bookmark', requireRole('student'), bookmarkJob);
router.delete('/jobs/:jobId/bookmark', requireRole('student'), removeBookmark);
router.get('/bookmarks', requireRole('student'), getBookmarks);
router.get('/applications', requireRole('student'), getApplications);

router.get('/career-path', requireRole('student'), getCareerPath);

export default router;
