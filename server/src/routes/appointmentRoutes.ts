import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { create, list, updateStatus } from '../controllers/appointmentController';

const router = Router();

router.use(authMiddleware);

router.post('/', create);
router.get('/', list);
router.patch('/:id/status', updateStatus);

export default router;
