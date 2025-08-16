import { Request, Response } from 'express';
import { getBaileysSocket } from '../config/baileys.config';
import { logger } from '../utils/logger';

export async function sendMessageFromWebhook(req: Request, res: Response) {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Parâmetros `to` e `message` são obrigatórios.' });
  }

  const sock = getBaileysSocket();

  if (!sock || !sock.user) {
    logger.error('Baileys socket not initialized or connected. Cannot send message.');
    return res.status(500).json({ error: 'Bot não está conectado ao WhatsApp.' });
  }

  try {
    await sock.sendMessage(to, { text: message });
    logger.info(`Mensagem enviada para ${to} via webhook.`);
    res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso.' });
  } catch (error: unknown) {
    logger.error(`Erro ao enviar mensagem para ${to} via webhook:`, error);
    let errorMessage = 'Erro desconhecido ao enviar mensagem.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: 'Falha ao enviar mensagem.', details: errorMessage });
  }
}


