import { create, Whatsapp } from '@wppconnect-team/wppconnect';
import { ENV } from './env';
import { logger } from '../utils/logger';

export let client: Whatsapp;

export async function startWppConnect() {
  try {
    client = await create({
      session: ENV.WPPCONNECT_SESSION_NAME,
      catchQR: (base64Qr: string, asciiQr: string) => {
        logger.info('QR Code received:');
        logger.info(asciiQr);
        // You can also send the base64Qr to a frontend or save it as an image
      },
      statusFind: (statusSession: string, session: string) => {
        logger.info('Status Session:', statusSession);
        logger.info('Session name:', session);
      },
      folderNameToken: 'storage/sessions',
      puppeteerOptions: {
        userDataDir: './storage/sessions/' + ENV.WPPCONNECT_SESSION_NAME,
      },
    });
    logger.info('WPPConnect client started successfully!');
  } catch (error) {
    logger.error('Error starting WPPConnect client:', error);
    process.exit(1);
  }
}


