export const mockAuth = (req, res, next) => {
  let token = null;
  
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  if (!token.includes('-')) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const [userId, role] = token.split('-');
  
  req.user = {
    id: userId,
    role: role || 'student'
  };
  
  next();
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    next();
  };
};
