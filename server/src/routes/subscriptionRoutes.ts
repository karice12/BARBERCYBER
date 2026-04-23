import { Router } from 'express';
import { createCheckoutSession, cancelSubscription } from '../controllers/subscriptionController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/checkout', authMiddleware, createCheckoutSession);
router.post('/cancel', authMiddleware, cancelSubscription);

export default router;
