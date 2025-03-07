import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    req.user = decoded;
   
   
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};

export const roleMiddleware = (role: 'recruiter' | 'candidate') => (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("Token:", req.user?.id);
  if (req.user?.role !== role)  {
    res.status(403).json({ message: 'Access denied' })
     return;
    };
  next();
};