import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { IUserJwtPayload } from '../models/User';

declare module 'express-serve-static-core' {
  interface Request {
    userId: number
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const reqToken = req?.signedCookies['e-access-token'];
  if (!reqToken) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }
  try {
    const { _id } = <IUserJwtPayload>jwt.verify(reqToken, process.env.JWT_SECRET as string);
    req.userId = _id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export { verifyToken };