import Student from '../models/Student.js';
import Employee from '../models/Employee.js';

const toUserJSON = (user, role) => {
  if (!user) return null;
  const userObj = user.toObject ? user.toObject() : user;
  if (userObj._id) {
    userObj.id = userObj._id.toString();
    delete userObj._id;
  }
  userObj.role = role;
  return userObj;
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    let user = null;
    
    if (role === 'employee') {
      const emp = await Employee.findOne({ email });
      if (emp && await emp.comparePassword(password)) {
        user = toUserJSON(emp, 'employee');
      }
    } else {
      const student = await Student.findOne({ email });
      if (student && await student.comparePassword(password)) {
        user = toUserJSON(student, 'student');
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = `${user.id}-${user.role}`;
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, company, education } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (role === 'employee') {
      const existingUser = await Employee.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      const newUser = await Employee.create({
        name,
        email,
        password,
        role: 'employee',
        company: company || 'Company'
      });
      res.status(201).json({ message: 'Employee registered successfully', userId: newUser._id.toString() });
    } else {
      const existingUser = await Student.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      const newUser = await Student.create({
        name,
        email,
        password,
        role: 'student',
        education: education || 'University',
        skills: []
      });
      res.status(201).json({ message: 'Student registered successfully', userId: newUser._id.toString() });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { id, role } = req.user;
    
    if (role === 'employee') {
      const user = await Employee.findById(id).select('-password');
      if (user) {
        return res.json(toUserJSON(user, 'employee'));
      }
    } else {
      const user = await Student.findById(id).select('-password');
      if (user) {
        return res.json(toUserJSON(user, 'student'));
      }
    }
    
    res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
