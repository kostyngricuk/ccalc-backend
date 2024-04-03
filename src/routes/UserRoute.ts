import express from 'express';
import { update, changePassword } from '../controllers/UserController';
import { verifyToken } from '../middlewares/AuthMiddleware';

const router = express.Router();

router.use(verifyToken);

router.route('/update').post(update);
router.route('/changePassword').post(changePassword);

export default router;