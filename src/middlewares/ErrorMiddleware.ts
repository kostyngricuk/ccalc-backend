import { Request, Response, NextFunction } from 'express';

const notFound = async (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`REQUEST_NOT_FOUND`);
  res.status(404);
  next(error);
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(res.statusCode);
  res.json({ success: false, errorCode: err.message });
};

export { notFound, errorHandler };