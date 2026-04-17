import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { daily } from '../controllers/reportController';

const router = Router();

router.use(authMiddleware);

router.get('/daily', daily);

export default router;
