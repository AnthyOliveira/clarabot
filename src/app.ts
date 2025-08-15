import express from 'express';
import { ENV } from './config/env';
import { logger } from './utils/logger';
import { webhookRoutes } from './routes/webhook.routes';
import { sessionRoutes } from './routes/session.routes';

import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/webhook', webhookRoutes);
app.use('/session', sessionRoutes);

app.get('/', (req, res) => {
  res.send('WhatsApp Bot is running!');
});

app.use(errorHandler);

export default app;


