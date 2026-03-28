import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const studentService = {
  getJobs: (params) => api.get('/student/jobs', { params }),
  getRecommendedJobs: () => api.get('/student/jobs/recommended'),
  getMatchingJobs: () => api.get('/student/jobs/matching'),
  getJobById: (id) => api.get(`/student/jobs/${id}`),
  applyForJob: (jobId) => api.post(`/student/jobs/${jobId}/apply`),
  bookmarkJob: (jobId) => api.post(`/student/jobs/${jobId}/bookmark`),
  removeBookmark: (jobId) => api.delete(`/student/jobs/${jobId}/bookmark`),
  getBookmarks: () => api.get('/student/bookmarks'),
  getApplications: () => api.get('/student/applications'),
  getCareerPath: () => api.get('/student/career-path'),
};

export const employeeService = {
  getPostedJobs: () => api.get('/employee/jobs'),
  getApplicants: (jobId) => api.get(`/employee/jobs/${jobId}/applicants`),
  updateStatus: (applicationId, status) => 
    api.patch(`/employee/applications/${applicationId}/status`, { status }),
};

export const profileService = {
  getStudentProfile: () => api.get('/profile/student'),
  updateStudentProfile: (data) => api.put('/profile/student', data),
  addSkill: (skill) => api.post('/profile/student/skills', { skill }),
  removeSkill: (skill) => api.delete('/profile/student/skills', { data: { skill } }),
  getEmployeeProfile: () => api.get('/profile/employee'),
  updateEmployeeProfile: (data) => api.put('/profile/employee', data),
};

export default api;
