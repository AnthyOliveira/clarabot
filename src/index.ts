import 'dotenv/config';
import app from './app';
import { logger } from './utils/logger';
import { startBaileys } from './config/baileys.config';

const PORT = process.env.PORT || 3000;

async function main() {
  await startBaileys();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

main();


