import { Request, Response } from 'express';
import { client } from '../config/wppconnect.config';
import { logger } from '../utils/logger';

export async function sendMessageFromWebhook(req: Request, res: Response) {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Parâmetros `to` e `message` são obrigatórios.' });
  }

  if (!client) {
    logger.error('WPPConnect client not initialized. Cannot send message.');
    return res.status(500).json({ error: 'Bot não está conectado ao WhatsApp.' });
  }

  try {
    await client.sendText(to, message);
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


