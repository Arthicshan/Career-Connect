import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Reviewed', 'Interview', 'Accepted', 'Rejected'],
    default: 'Pending' 
  },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
