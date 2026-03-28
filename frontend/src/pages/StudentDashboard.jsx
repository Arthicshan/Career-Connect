import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [careerPath, setCareerPath] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ skills: '', location: '', type: '' });
  const [applying, setApplying] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'jobs') {
      searchJobs();
    }
  }, [debouncedSearch, debouncedFilters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, recommendedRes, applicationsRes, bookmarksRes, careerRes] = await Promise.all([
        studentService.getJobs(),
        studentService.getRecommendedJobs(),
        studentService.getApplications(),
        studentService.getBookmarks(),
        studentService.getCareerPath(),
      ]);
      setJobs(jobsRes.data);
      setRecommendedJobs(recommendedRes.data);
      setApplications(applicationsRes.data);
      setBookmarks(bookmarksRes.data);
      setCareerPath(careerRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = useCallback(async () => {
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (debouncedFilters.skills) params.skills = debouncedFilters.skills;
      if (debouncedFilters.location) params.location = debouncedFilters.location;
      if (debouncedFilters.type) params.type = debouncedFilters.type;
      
      const res = await studentService.getJobs(params);
      setJobs(res.data);
    } catch (err) {
      console.error('Search error:', err);
    }
  }, [debouncedSearch, debouncedFilters.skills, debouncedFilters.location, debouncedFilters.type]);

  const handleFilter = async () => {
    try {
      const params = {};
      if (filters.skills) params.skills = filters.skills;
      if (filters.location) params.location = filters.location;
      if (filters.type) params.type = filters.type;
      const res = await studentService.getJobs(params);
      setJobs(res.data);
    } catch (err) {
      console.error('Filter error:', err);
    }
  };

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await studentService.applyForJob(jobId);
      await loadData();
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  const handleBookmark = async (jobId, isBookmarked) => {
    try {
      if (isBookmarked) {
        await studentService.removeBookmark(jobId);
        toast.success('Removed from saved');
      } else {
        await studentService.bookmarkJob(jobId);
        toast.success('Job saved!');
      }
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to bookmark');
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 70) return 'bg-[#378ADD]';
    if (percentage >= 40) return 'bg-[#85B7EB]';
    return 'bg-[#185FA5]';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F2EE] flex items-center justify-center">
        <div className="text-[#666666]">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'jobs', label: 'Jobs' },
    { id: 'recommended', label: 'Recommended' },
    { id: 'applications', label: 'Applications' },
    { id: 'bookmarks', label: 'Saved' },
    { id: 'career', label: 'Career' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      <header className="bg-white border-b border-[#E0E0E0] sticky top-0 z-50">
        <div className="max-w-[1128px] mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-[#378ADD]">Career Connect</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs, skills, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#E6F1FB] border-none rounded-md py-2 px-4 pr-10 w-80 focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">🔍</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/student/profile')}
                className="text-sm text-[#666666] hover:text-[#378ADD]"
              >
                My Profile
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#85B7EB] rounded-full flex items-center justify-center text-sm font-semibold text-white">
                  {user?.name?.charAt(0)}
                </div>
                <span className="text-sm text-[#666666]">
                  {user?.name?.split(' ')[0]}
                </span>
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
        <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] mb-6">
          <div className="flex border-b border-[#E0E0E0]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'text-[#378ADD] border-[#378ADD]'
                    : 'text-[#666666] border-transparent hover:text-[#378ADD]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-6">
          {activeTab === 'jobs' && (
            <div>
              <div className="flex flex-wrap gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Filter by skills..."
                  value={filters.skills}
                  onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                  className="flex-1 min-w-[200px] p-3 border border-[#E0E0E0] rounded-md focus:outline-none focus:border-[#378ADD]"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-48 p-3 border border-[#E0E0E0] rounded-md focus:outline-none focus:border-[#378ADD]"
                />
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="p-3 border border-[#E0E0E0] rounded-md focus:outline-none focus:border-[#378ADD] bg-white"
                >
                  <option value="">Job Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                </select>
                <button
                  onClick={handleFilter}
                  className="bg-[#378ADD] text-white px-6 py-3 rounded-md font-medium hover:bg-[#185FA5] transition"
                >
                  Search
                </button>
              </div>

              <p className="text-sm text-[#666666] mb-4">
                {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
              </p>

              <div className="space-y-4">
                {jobs.map((job) => {
                  const hasApplied = applications.some((a) => a.jobId === job.id);
                  const isBookmarked = bookmarks.some((b) => b.id === job.id);

                  return (
                    <div
                      key={job.id}
                      className="border border-[#E0E0E0] rounded-lg p-5 hover:shadow-md transition"
                    >
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#378ADD]">{job.title}</h3>
                          <p className="text-[#00000099] text-sm">{job.company}</p>
                          <div className="flex items-center gap-4 text-sm text-[#666666] mt-2">
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.type}</span>
                          </div>
                          <p className="text-[#00000099] text-sm mt-3 line-clamp-2">{job.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="bg-[#E6F1FB] text-[#185FA5] px-2 py-1 rounded-md text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => handleBookmark(job.id, isBookmarked)}
                            className={`p-2 rounded-md border transition ${
                              isBookmarked
                                ? 'bg-[#378ADD] text-white border-[#378ADD]'
                                : 'bg-white text-[#378ADD] border-[#378ADD] hover:bg-[#E6F1FB]'
                            }`}
                          >
                            {isBookmarked ? '★ Saved' : '☆ Save'}
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#E0E0E0] flex gap-3">
                        <button
                          onClick={() => handleApply(job.id)}
                          disabled={hasApplied || applying === job.id}
                          className={`px-6 py-2 rounded-full font-medium transition ${
                            hasApplied
                              ? 'bg-[#378ADD] text-white'
                              : 'bg-[#378ADD] text-white hover:bg-[#185FA5]'
                          } disabled:opacity-50`}
                        >
                          {hasApplied ? '✓ Applied' : applying === job.id ? 'Applying...' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {jobs.length === 0 && (
                <div className="text-center py-12 text-[#666666]">
                  No jobs found. Try adjusting your search.
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommended' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Jobs for you</h2>
              {recommendedJobs.map((job) => {
                const hasApplied = applications.some((a) => a.jobId === job.id);

                return (
                  <div
                    key={job.id}
                    className="border border-[#E0E0E0] rounded-lg p-5 hover:shadow-md transition"
                  >
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`${getMatchColor(job.matchPercentage)} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                            {job.matchPercentage}% match
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-[#378ADD]">{job.title}</h3>
                        <p className="text-[#00000099] text-sm">{job.company}</p>
                        <div className="flex items-center gap-4 text-sm text-[#666666] mt-2">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.type}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="bg-[#E6F1FB] text-[#185FA5] px-2 py-1 rounded-md text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#E0E0E0]">
                      <button
                        onClick={() => handleApply(job.id)}
                        disabled={hasApplied}
                        className={`px-6 py-2 rounded-full font-medium transition ${
                          hasApplied
                            ? 'bg-[#378ADD] text-white'
                            : 'bg-[#378ADD] text-white hover:bg-[#185FA5]'
                        }`}
                      >
                        {hasApplied ? '✓ Applied' : 'Easy Apply'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Your applications</h2>
              {applications.length === 0 ? (
                <div className="text-center py-12 text-[#666666]">No applications yet</div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className="border border-[#E0E0E0] rounded-lg p-5"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-[#378ADD]">{app.job?.title}</h3>
                        <p className="text-[#00000099] text-sm">{app.job?.company}</p>
                        <p className="text-[#666666] text-xs mt-1">
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          app.status === 'Pending'
                            ? 'bg-[#E6F1FB] text-[#185FA5]'
                            : app.status === 'Reviewed'
                            ? 'bg-[#CCE5FF] text-[#004085]'
                            : app.status === 'Interview'
                            ? 'bg-[#85B7EB] text-white'
                            : app.status === 'Accepted'
                            ? 'bg-[#378ADD] text-white'
                            : 'bg-[#F8D7DA] text-[#721C24]'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Saved jobs</h2>
              {bookmarks.length === 0 ? (
                <div className="text-center py-12 text-[#666666]">No saved jobs yet</div>
              ) : (
                bookmarks.map((job) => (
                  <div
                    key={job.id}
                    className="border border-[#E0E0E0] rounded-lg p-5"
                  >
                    <h3 className="font-semibold text-[#378ADD]">{job.title}</h3>
                    <p className="text-[#00000099] text-sm">{job.company}</p>
                    <div className="flex gap-4 text-sm text-[#666666] mt-2">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                    <button
                      onClick={() => handleBookmark(job.id, true)}
                      className="mt-3 text-sm text-[#666666] hover:text-[#378ADD]"
                    >
                      Remove from saved
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'career' && careerPath && (
            <div className="space-y-6">
              <div className="border-b border-[#E0E0E0] pb-4">
                <h2 className="text-xl font-semibold text-[#1A1A1A]">Your skills & career paths</h2>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#1A1A1A] mb-3">Skills you have</h3>
                <div className="flex flex-wrap gap-2">
                  {careerPath.currentSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-[#E6F1FB] text-[#185FA5] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#1A1A1A] mb-3">Skills to learn</h3>
                <div className="flex flex-wrap gap-2">
                  {careerPath.suggestedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-[#85B7EB] text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#1A1A1A] mb-4">Career paths</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerPath.careerPaths.map((path, i) => (
                    <div key={i} className="border border-[#E0E0E0] rounded-lg p-4">
                      <h4 className="font-semibold text-[#378ADD] mb-2">{path.title}</h4>
                      <div className="flex flex-wrap gap-1">
                        {path.skills.map((skill, j) => (
                          <span
                            key={j}
                            className="bg-[#E6F1FB] text-[#185FA5] px-2 py-0.5 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
