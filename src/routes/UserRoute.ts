import express from 'express';
import { update } from '../controllers/UserController';
import { verifyToken } from '../middlewares/AuthMiddleware';

const router = express.Router();

router.use(verifyToken);

router.route('/update').post(update);

export default router;