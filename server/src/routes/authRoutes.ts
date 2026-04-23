import { Router } from 'express';
import { getMe, updateMe } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas as rotas exigem token JWT válido do Supabase Auth
router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);

export default router;
