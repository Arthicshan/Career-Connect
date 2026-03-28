import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Bookmark from '../models/Bookmark.js';
import { toJSON, toJSONArray } from '../utils/helpers.js';

export const bookmarkJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user.id;
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const existing = await Bookmark.findOne({ studentId, jobId });
    if (existing) {
      return res.status(400).json({ error: 'Job already bookmarked' });
    }
    
    await Bookmark.create({ studentId, jobId });
    
    res.status(201).json({ message: 'Job bookmarked successfully' });
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user.id;
    
    const bookmark = await Bookmark.findOneAndDelete({ studentId, jobId });
    
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const bookmarks = await Bookmark.find({ studentId }).sort({ createdAt: -1 });
    
    const jobs = await Promise.all(
      bookmarks.map(async (b) => {
        const job = await Job.findById(b.jobId);
        if (job) {
          const jobObj = toJSON(job);
          jobObj.bookmarkedAt = b.createdAt;
          return jobObj;
        }
        return null;
      })
    );
    
    res.json(jobs.filter(Boolean));
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user.id;
    
    if (req.user.role === 'employee') {
      return res.status(403).json({ error: 'Employees cannot apply for jobs' });
    }
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const existing = await Application.findOne({ studentId, jobId });
    if (existing) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }
    
    const application = await Application.create({ studentId, jobId });
    
    res.status(201).json({ 
      message: 'Application submitted successfully',
      application: toJSON(application)
    });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getApplications = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const applications = await Application.find({ studentId })
      .sort({ appliedAt: -1 })
      .populate('jobId');
    
    const result = applications.map(app => {
      const appObj = toJSON(app);
      return {
        ...appObj,
        jobId: app.jobId?._id?.toString(),
        job: app.jobId ? {
          id: app.jobId._id.toString(),
          title: app.jobId.title,
          company: app.jobId.company,
          location: app.jobId.location,
          type: app.jobId.type
        } : null
      };
    });
    
    res.json(result);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
