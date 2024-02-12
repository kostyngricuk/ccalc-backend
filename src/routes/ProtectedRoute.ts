import express from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware';

const router = express.Router();

router.use(verifyToken);

export default router;
