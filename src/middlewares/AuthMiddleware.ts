import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

declare module 'express-serve-static-core' {
  interface Request {
    userId: number
  }
}
interface IUserJwtPayload {
  id: number
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }
  try {
    const { id } = <IUserJwtPayload>jwt.verify(token, process.env.JWT_SECRET as string);
    req.userId = id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export { verifyToken };