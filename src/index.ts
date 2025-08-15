import 'dotenv/config';
import app from './app';
import { logger } from './utils/logger';
import { startWppConnect, client } from './config/wppconnect.config';
import { processIncomingMessage } from './services/message.service';

const PORT = process.env.PORT || 3000;

async function startBot() {
  await startWppConnect();

  if (client) {
    client.onMessage(async (message) => {
      await processIncomingMessage(client, message);
    });
    logger.info('WPPConnect client is listening for messages.');
  } else {
    logger.error('WPPConnect client not initialized.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

startBot();


