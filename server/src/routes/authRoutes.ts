import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  getBusinessHours,
  upsertBusinessHours,
} from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Rotas protegidas
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfile);

router.get('/business-hours', authMiddleware, getBusinessHours);
router.put('/business-hours', authMiddleware, upsertBusinessHours);

export default router;
