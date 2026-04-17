import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { summary } from '../controllers/financeController';

const router = Router();

router.use(authMiddleware);

router.get('/summary', summary);

export default router;
