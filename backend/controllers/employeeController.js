import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { toJSON } from '../utils/helpers.js';

export const getApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employeeId = req.user.id;
    
    const job = await Job.findOne({ _id: jobId, employeeId });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }
    
    const applications = await Application.find({ jobId }).populate('studentId', '-password');
    
    const result = applications.map(app => {
      const appObj = toJSON(app);
      return {
        ...appObj,
        studentId: app.studentId?._id?.toString(),
        jobId: app.jobId?.toString(),
        student: app.studentId ? {
          id: app.studentId._id.toString(),
          name: app.studentId.name,
          email: app.studentId.email,
          education: app.studentId.education,
          skills: app.studentId.skills
        } : null
      };
    });
    
    res.json(result);
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['Pending', 'Reviewed', 'Interview', 'Accepted', 'Rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({ message: 'Status updated', application: toJSON(application) });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllPostedJobs = async (req, res) => {
  try {
    const employeeId = req.user.id;
    
    const jobs = await Job.find({ employeeId }).sort({ createdAt: -1 });
    
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const jobObj = toJSON(job);
        const applicants = await Application.find({ jobId: job._id });
        const pendingCount = applicants.filter(a => a.status === 'Pending').length;
        
        return {
          ...jobObj,
          applicantCount: applicants.length,
          pendingCount
        };
      })
    );
    
    res.json(jobsWithStats);
  } catch (error) {
    console.error('Get posted jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
