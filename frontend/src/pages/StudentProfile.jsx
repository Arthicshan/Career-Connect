import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await profileService.getStudentProfile();
      setProfile(res.data);
      setFormData({
        name: res.data.name || '',
        education: res.data.education || '',
        skills: res.data.skills || [],
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
      await profileService.updateStudentProfile(formData);
      toast.success('Profile saved!');
      await loadProfile();
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    
    try {
      await profileService.addSkill(newSkill.trim());
      await loadProfile();
      setNewSkill('');
      toast.success('Skill added!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skill) => {
    try {
      await profileService.removeSkill(skill);
      await loadProfile();
      toast.success('Skill removed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove skill');
    }
  };

  const suggestedSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning',
    'SQL', 'MongoDB', 'AWS', 'Docker', 'TypeScript', 'Vue.js',
    'Angular', 'Django', 'Flask', 'TensorFlow', 'Git',
    'CSS', 'HTML', 'PostgreSQL', 'Redis', 'Linux', 'Kubernetes', 'Flutter'
  ];

  const availableSkills = suggestedSkills.filter(s => !formData.skills.includes(s));

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
              <span className="text-sm text-[#666666]">Profile</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/student')}
                className="text-sm text-[#378ADD] hover:underline"
              >
                ← Back to Jobs
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
          <div className="h-32 bg-gradient-to-r from-[#378ADD] to-[#85B7EB]"></div>
          
          <div className="px-6 pb-6">
            <div className="relative flex justify-between items-end -mt-12 mb-4">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 bg-white rounded-lg border-4 border-white shadow-md flex items-center justify-center text-[#378ADD] text-3xl font-bold">
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
                <h3 className="font-semibold text-[#1A1A1A] mb-3">About</h3>
                
                {editing ? (
                  <form onSubmit={handleSave} className="space-y-3">
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
                      <label className="block text-xs font-medium text-[#666666] mb-1">Education / University</label>
                      <input
                        type="text"
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        className="w-full p-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:border-[#378ADD]"
                        placeholder="e.g., SLIIT, UOM"
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
                  <p className="text-sm text-[#666666]">
                    {profile?.education || 'Add your education to help employers find you'}
                  </p>
                )}
              </div>

              <div className="border-t border-[#E0E0E0] pt-4">
                <h3 className="font-semibold text-[#1A1A1A] mb-3">Skills</h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.skills.length === 0 ? (
                    <p className="text-sm text-[#666666]">No skills added yet</p>
                  ) : (
                    formData.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-[#E6F1FB] text-[#185FA5] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-600 font-bold ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 p-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:border-[#378ADD] text-sm"
                    placeholder="Add a skill..."
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#378ADD] text-white rounded-md text-sm font-medium hover:bg-[#185FA5] transition"
                  >
                    Add
                  </button>
                </form>

                <div className="mt-4">
                  <p className="text-xs text-[#666666] mb-2">Popular skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {availableSkills.slice(0, 15).map((skill, i) => (
                      <button
                        key={i}
                        onClick={() => setNewSkill(skill)}
                        className="bg-[#F4F2EE] text-[#666666] px-2 py-0.5 rounded text-xs hover:bg-[#E6F1FB] hover:text-[#378ADD] transition"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/student')}
            className="px-6 py-3 bg-[#378ADD] text-white rounded-full font-medium hover:bg-[#185FA5] transition flex items-center gap-2"
          >
            View Jobs & Match
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
