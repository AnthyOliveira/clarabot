import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { logger } from '../utils/logger';
import { processIncomingMessage } from '../services/message.service';

let sock: any;

export async function startBaileys() {
  const { state, saveCreds } = await useMultiFileAuthState('storage/sessions');

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: logger as any, // Baileys expects a pino logger, but winston can be adapted
  });

  sock.ev.on('connection.update', (update: any) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      logger.info('QR Code recebido. Escaneie com seu celular:');
      // QR code will be printed in terminal due to printQRInTerminal: true
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      logger.error('Conexão fechada devido a', lastDisconnect.error, ', reconectando:', shouldReconnect);
      // reconnect if not logged out
      if (shouldReconnect) {
        startBaileys();
      }
    } else if (connection === 'open') {
      logger.info('Conexão Baileys aberta!');
    }
  });

  sock.ev.on('messages.upsert', async (m: any) => {
    const msg = m.messages[0];
    if (!msg.key.fromMe && m.type === 'notify') {
      await processIncomingMessage(sock, msg);
    }
  });

  sock.ev.on('creds.update', saveCreds);

  return sock;
}

export function getBaileysSocket() {
  return sock;
}


