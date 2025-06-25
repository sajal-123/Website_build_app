import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    console.log('Authorization header:');
    const authHeader = req.headers.authorization;
    if (!authHeader){
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token){
      res.status(401).json({ error: 'Unauthorized' });
      return;
    } 

    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY!) as any;

    const userId = decoded.sub;
    console.log('Decoded token:', decoded.sub);

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
    return;
  }

    req.userId = userId;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
