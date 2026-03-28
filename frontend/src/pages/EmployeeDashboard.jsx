import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { employeeService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await employeeService.getPostedJobs();
      setJobs(res.data);
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplicants = async (jobId) => {
    try {
      const res = await employeeService.getApplicants(jobId);
      setApplicants(res.data);
    } catch (err) {
      console.error('Error loading applicants:', err);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    loadApplicants(job.id);
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await employeeService.updateStatus(applicationId, status);
      if (selectedJob) {
        loadApplicants(selectedJob.id);
      }
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F2EE] flex items-center justify-center">
        <div className="text-[#666666]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      <header className="bg-white border-b border-[#E0E0E0] sticky top-0 z-50">
        <div className="max-w-[1128px] mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-[#378ADD]">Career Connect</h1>
              <span className="text-sm text-[#666666]">Recruiter</span>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/employee/profile')}
                className="text-sm text-[#666666] hover:text-[#378ADD]"
              >
                My Profile
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#85B7EB] rounded-full flex items-center justify-center text-sm font-semibold text-white">
                  {user?.name?.charAt(0)}
                </div>
                <span className="text-sm text-[#666666]">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-[#666666] hover:text-[#378ADD]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0]">
              <div className="p-4 border-b border-[#E0E0E0]">
                <h2 className="font-semibold text-[#1A1A1A]">Your Job Posts</h2>
                <p className="text-sm text-[#666666]">{jobs.length} jobs posted</p>
              </div>
              <div className="p-2">
                {jobs.length === 0 ? (
                  <div className="text-center py-8 text-[#666666]">No job posts yet</div>
                ) : (
                  <div className="space-y-2">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => handleJobSelect(job)}
                        className={`p-3 rounded-md cursor-pointer transition ${
                          selectedJob?.id === job.id
                            ? 'bg-[#E6F1FB] border border-[#378ADD]'
                            : 'hover:bg-[#F4F2EE] border border-transparent'
                        }`}
                      >
                        <h3 className="font-medium text-[#1A1A1A] text-sm">{job.title}</h3>
                        <div className="flex gap-3 text-xs text-[#666666] mt-1">
                          <span>{job.applicantCount} applicants</span>
                          {job.pendingCount > 0 && (
                            <span className="text-[#85B7EB]">• {job.pendingCount} pending</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0]">
              {selectedJob ? (
                <>
                  <div className="p-4 border-b border-[#E0E0E0]">
                    <h2 className="font-semibold text-[#1A1A1A]">
                      Applicants for {selectedJob.title}
                    </h2>
                    <p className="text-sm text-[#666666]">{applicants.length} applicants</p>
                  </div>
                  <div className="p-4">
                    {applicants.length === 0 ? (
                      <div className="text-center py-12 text-[#666666]">No applicants yet</div>
                    ) : (
                      <div className="space-y-4">
                        {applicants.map((applicant) => (
                          <div
                            key={applicant.id}
                            className="border border-[#E0E0E0] rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 bg-[#85B7EB] rounded-full flex items-center justify-center text-white font-semibold">
                                    {applicant.student?.name?.charAt(0)}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-[#378ADD]">
                                      {applicant.student?.name}
                                    </h3>
                                    <p className="text-[#00000099] text-sm">
                                      {applicant.student?.email}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {applicant.student?.skills?.map((skill, i) => (
                                    <span
                                      key={i}
                                      className="bg-[#E6F1FB] text-[#185FA5] px-2 py-0.5 rounded text-xs"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-[#666666] text-xs mt-3">
                                  Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <select
                                value={applicant.status}
                                onChange={(e) =>
                                  handleStatusUpdate(applicant.id, e.target.value)
                                }
                                className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer border-0 ${
                                  applicant.status === 'Pending'
                                    ? 'bg-[#E6F1FB] text-[#185FA5]'
                                    : applicant.status === 'Reviewed'
                                    ? 'bg-[#CCE5FF] text-[#004085]'
                                    : applicant.status === 'Interview'
                                    ? 'bg-[#85B7EB] text-white'
                                    : applicant.status === 'Accepted'
                                    ? 'bg-[#378ADD] text-white'
                                    : 'bg-[#F8D7DA] text-[#721C24]'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Interview">Interview</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-[#666666]">
                  Select a job post to view applicants
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
