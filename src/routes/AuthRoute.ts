import express from 'express';
import {
  login,
  register,
  reset,
  verifyCode
} from '../controllers/AuthController';

const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/reset').post(reset);
router.route('/verifyCode').post(verifyCode);

export default router;