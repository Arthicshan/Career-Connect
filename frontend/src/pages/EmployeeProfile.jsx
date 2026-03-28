import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const EmployeeProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await profileService.getEmployeeProfile();
      setProfile(res.data);
      setFormData({
        name: res.data.name || '',
        company: res.data.company || '',
      });
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileService.updateEmployeeProfile(formData);
      toast.success('Profile saved!');
      await loadProfile();
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
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
      <header className="bg-white border-b border-[#E0E0E0] shadow-sm">
        <div className="max-w-[900px] mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-[#378ADD]">Career Connect</h1>
              <span className="text-[#666666]">|</span>
              <span className="text-sm text-[#666666]">Recruiter Profile</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/employee')}
                className="text-sm text-[#378ADD] hover:underline"
              >
                ← Back to Dashboard
              </button>
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

      <div className="max-w-[900px] mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-[#185FA5] to-[#378ADD]"></div>
          
          <div className="px-6 pb-6">
            <div className="relative flex justify-between items-end -mt-12 mb-4">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 bg-[#185FA5] rounded-lg border-4 border-white shadow-md flex items-center justify-center text-white text-3xl font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">{profile?.name}</h2>
                  <p className="text-[#666666]">{profile?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="mb-2 px-4 py-2 border border-[#378ADD] text-[#378ADD] rounded-full text-sm font-medium hover:bg-[#E6F1FB] transition"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-t border-[#E0E0E0] pt-4">
                <h3 className="font-semibold text-[#1A1A1A] mb-3">Company Information</h3>
                
                {editing ? (
                  <form onSubmit={handleSave} className="space-y-3 max-w-md">
                    <div>
                      <label className="block text-xs font-medium text-[#666666] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:border-[#378ADD]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#666666] mb-1">Company Name</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full p-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:border-[#378ADD]"
                        placeholder="Your company name"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-[#378ADD] text-white rounded-md text-sm font-medium hover:bg-[#185FA5] transition disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#666666]">Name:</span>
                      <span className="text-sm text-[#1A1A1A]">{profile?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#666666]">Company:</span>
                      <span className="text-sm text-[#1A1A1A]">{profile?.company || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#666666]">Email:</span>
                      <span className="text-sm text-[#1A1A1A]">{profile?.email}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[#E0E0E0] pt-4">
                <h3 className="font-semibold text-[#1A1A1A] mb-3">Quick Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#E6F1FB] p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[#378ADD]">-</div>
                    <div className="text-xs text-[#666666]">Jobs Posted</div>
                  </div>
                  <div className="bg-[#E6F1FB] p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[#378ADD]">-</div>
                    <div className="text-xs text-[#666666]">Total Applicants</div>
                  </div>
                  <div className="bg-[#E6F1FB] p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[#378ADD]">-</div>
                    <div className="text-xs text-[#666666]">Pending Review</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/employee')}
            className="px-6 py-3 bg-[#378ADD] text-white rounded-full font-medium hover:bg-[#185FA5] transition flex items-center gap-2"
          >
            Manage Job Posts
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
