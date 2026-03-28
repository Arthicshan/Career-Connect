import Student from '../models/Student.js';
import Employee from '../models/Employee.js';

export const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const student = await Student.findById(studentId).select('-password');
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const studentObj = student.toObject();
    studentObj.id = studentObj._id.toString();
    delete studentObj._id;
    delete studentObj.password;
    
    res.json(studentObj);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { name, education, skills } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (education !== undefined) updateData.education = education;
    if (skills !== undefined) updateData.skills = skills;
    
    const student = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const studentObj = student.toObject();
    studentObj.id = studentObj._id.toString();
    delete studentObj._id;
    
    res.json({ message: 'Profile updated', user: studentObj });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addSkill = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { skill } = req.body;
    
    if (!skill || typeof skill !== 'string') {
      return res.status(400).json({ error: 'Skill is required' });
    }
    
    const trimmedSkill = skill.trim();
    
    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    if (!student.skills.includes(trimmedSkill)) {
      student.skills.push(trimmedSkill);
      await student.save();
    }
    
    const studentObj = student.toObject();
    studentObj.id = studentObj._id.toString();
    delete studentObj._id;
    
    res.json({ message: 'Skill added', skills: studentObj.skills });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const removeSkill = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { skill } = req.body;
    
    if (!skill) {
      return res.status(400).json({ error: 'Skill is required' });
    }
    
    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    student.skills = student.skills.filter(s => s !== skill);
    await student.save();
    
    res.json({ message: 'Skill removed', skills: student.skills });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.user.id;
    
    const employee = await Employee.findById(employeeId).select('-password');
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const employeeObj = employee.toObject();
    employeeObj.id = employeeObj._id.toString();
    delete employeeObj._id;
    delete employeeObj.password;
    
    res.json(employeeObj);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { name, company } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (company !== undefined) updateData.company = company;
    
    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const employeeObj = employee.toObject();
    employeeObj.id = employeeObj._id.toString();
    delete employeeObj._id;
    
    res.json({ message: 'Profile updated', user: employeeObj });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
