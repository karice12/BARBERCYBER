import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { create, list, getOne, update, remove } from '../controllers/staffController';

const router = Router();

router.use(authMiddleware);

router.post('/', create);
router.get('/', list);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
