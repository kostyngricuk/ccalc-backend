import express from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware';
import { getProducts } from '../controllers/ProductController';

const router = express.Router();

router.use(verifyToken);

router.route('/all').get(getProducts);

export default router;