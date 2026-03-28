import Student from '../models/Student.js';
import Job from '../models/Job.js';
import { toJSON, toJSONArray } from '../utils/helpers.js';

export const calculateMatch = (studentSkills, jobSkills) => {
  if (!jobSkills || jobSkills.length === 0) return 0;
  
  const matched = studentSkills.filter(skill => 
    jobSkills.some(jobSkill => 
      skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
      jobSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  return Math.round((matched.length / jobSkills.length) * 100);
};

export const getJobs = async (req, res) => {
  try {
    const { search, skills, location, type } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (skills) {
      const filterSkills = skills.split(',').map(s => s.trim());
      query.skills = { $in: filterSkills.map(s => new RegExp(s, 'i')) };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (type) {
      query.type = { $regex: type, $options: 'i' };
    }
    
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(toJSONArray(jobs));
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(toJSON(job));
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getRecommendedJobs = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const allJobs = await Job.find().sort({ createdAt: -1 });
    
    const jobsWithMatch = allJobs.map(job => {
      const jobObj = toJSON(job);
      jobObj.matchPercentage = calculateMatch(student.skills || [], job.skills || []);
      return jobObj;
    });
    
    const recommended = jobsWithMatch
      .filter(job => job.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);
    
    res.json(recommended);
  } catch (error) {
    console.error('Get recommended jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMatchingJobs = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const allJobs = await Job.find().sort({ createdAt: -1 });
    
    const jobsWithMatch = allJobs.map(job => {
      const jobObj = toJSON(job);
      const studentSkills = student.skills || [];
      const jobSkills = job.skills || [];
      
      const matchedSkills = studentSkills.filter(skill => 
        jobSkills.some(js => 
          skill.toLowerCase().includes(js.toLowerCase()) ||
          js.toLowerCase().includes(skill.toLowerCase())
        )
      );
      
      const missingSkills = jobSkills.filter(skill => 
        !studentSkills.some(s => 
          s.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(s.toLowerCase())
        )
      );
      
      return {
        ...jobObj,
        matchPercentage: calculateMatch(studentSkills, jobSkills),
        matchedSkills,
        missingSkills
      };
    });
    
    res.json(jobsWithMatch);
  } catch (error) {
    console.error('Get matching jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCareerPath = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const allJobs = await Job.find();
    const allSkills = [...new Set(allJobs.flatMap(j => j.skills || []))];
    
    const skillsToLearn = allSkills.filter(skill => 
      !(student.skills || []).some(s => 
        s.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(s.toLowerCase())
      )
    );
    
    res.json({
      currentSkills: student.skills || [],
      suggestedSkills: skillsToLearn.slice(0, 10),
      careerPaths: [
        { title: 'Frontend Developer', skills: ['React', 'Vue.js', 'TypeScript', 'CSS'] },
        { title: 'Backend Developer', skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis'] },
        { title: 'Full Stack Developer', skills: ['React', 'Node.js', 'MongoDB', 'Docker'] },
        { title: 'ML Engineer', skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL'] }
      ]
    });
  } catch (error) {
    console.error('Get career path error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
