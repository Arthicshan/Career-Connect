import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  location: { type: String, required: true },
  type: { type: String, required: true },
  salary: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

jobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });

export default mongoose.model('Job', jobSchema);
