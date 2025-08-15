import { Router } from 'express';
import { startSession, getSessionStatus, closeSession } from '../controllers/session.controller';

const router = Router();

router.post('/start', startSession);
router.get('/status', getSessionStatus);
router.post('/close', closeSession);

export { router as sessionRoutes };


