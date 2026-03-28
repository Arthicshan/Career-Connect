import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPopover = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password, role);
      onClose();
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'student') {
        navigate('/student');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Sign in</h2>
            <button onClick={onClose} className="text-[#666666] hover:text-[#1A1A1A]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-2.5 border border-[#E0E0E0] rounded-md focus:outline-none focus:border-[#378ADD] text-sm"
            />
            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-2.5 border border-[#E0E0E0] rounded-md focus:outline-none focus:border-[#378ADD] text-sm"
            />
            
            <div className="flex bg-[#E6F1FB] rounded-full p-0.5">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition ${
                  role === 'student' ? 'bg-[#378ADD] text-white' : 'text-[#666666]'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('employee')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition ${
                  role === 'employee' ? 'bg-[#378ADD] text-white' : 'text-[#666666]'
                }`}
              >
                Employer
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#378ADD] text-white py-2.5 rounded-md font-medium hover:bg-[#185FA5] transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          <p className="text-center text-[#666666] text-sm mt-4">
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} className="text-[#378ADD] font-medium hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const RegisterPopover = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      onClose();
      toast.success('Account created! Please sign in.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Create account</h2>
            <button onClick={onClose} className="text-[#666666] hover:text-[#1A1A1A]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-2.5 border border-[#E0E0E0] rounded-md focus:outline-none focus:border-[#378ADD] text-sm"
            />
            
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-2.5 border border-[#E0E0E0] rounded-md focus:outline-none focus:border-[#378ADD] text-sm"
            />
            
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password (6+ characters)"
              required
              className="w-full p-2.5 border border-[#E0E0E0] rounded-md focus:outline-none focus:border-[#378ADD] text-sm"
            />
            
            <div className="flex bg-[#E6F1FB] rounded-full p-0.5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition ${
                  formData.role === 'student' ? 'bg-[#378ADD] text-white' : 'text-[#666666]'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'employee' })}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition ${
                  formData.role === 'employee' ? 'bg-[#378ADD] text-white' : 'text-[#666666]'
                }`}
              >
                Employer
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#378ADD] text-white py-2.5 rounded-md font-medium hover:bg-[#185FA5] transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Creating...' : 'Sign up'}
            </button>
          </form>
          
          <p className="text-center text-[#666666] text-sm mt-4">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-[#378ADD] font-medium hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      <header className="bg-white border-b border-[#E0E0E0]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#378ADD]">Career Connect</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 text-sm font-medium text-[#378ADD] hover:bg-[#E6F1FB] rounded-md transition"
            >
              Sign in
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-[#378ADD] hover:bg-[#185FA5] rounded-md transition"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">
            Your Career Journey Starts Here
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Connect with top companies, discover opportunities, and take the next step in your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E0E0E0]">
            <div className="w-12 h-12 bg-[#E6F1FB] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#378ADD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Find Opportunities</h3>
            <p className="text-sm text-[#666666]">Browse thousands of jobs from top companies that match your skills.</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E0E0E0]">
            <div className="w-12 h-12 bg-[#E6F1FB] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#378ADD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Smart Matching</h3>
            <p className="text-sm text-[#666666]">Our AI matches you with jobs based on your skills and experience.</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E0E0E0]">
            <div className="w-12 h-12 bg-[#E6F1FB] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#378ADD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Track Progress</h3>
            <p className="text-sm text-[#666666]">Manage applications and track your career growth.</p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">For Employers</h3>
          <p className="text-[#666666] mb-6 max-w-xl mx-auto">
            Find talented candidates, manage applications, and build your team with ease.
          </p>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#666666] mb-4">Ready to get started?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowRegister(true)}
              className="px-6 py-3 text-sm font-medium text-white bg-[#378ADD] hover:bg-[#185FA5] rounded-md transition"
            >
              Create Account
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-3 text-sm font-medium text-[#378ADD] border border-[#378ADD] hover:bg-[#E6F1FB] rounded-md transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#E0E0E0] mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-[#666666]">
          © 2026 Career Connect. All rights reserved.
        </div>
      </footer>

      <LoginPopover
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterPopover
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
};

export default Landing;
