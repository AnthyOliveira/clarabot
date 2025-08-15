import { Router } from 'express';
import { sendMessageFromWebhook } from '../controllers/message.controller';

import { authenticateWebhook } from '../middlewares/auth.middleware';

const router = Router();

router.post('/send-message', authenticateWebhook, sendMessageFromWebhook);

export { router as webhookRoutes };


