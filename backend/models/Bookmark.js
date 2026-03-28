import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  createdAt: { type: Date, default: Date.now }
});

bookmarkSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);
