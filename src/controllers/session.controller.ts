import { Request, Response } from 'express';
import { startBaileys, getBaileysSocket } from '../config/baileys.config';
import { logger } from '../utils/logger';

export async function startSession(req: Request, res: Response) {
  try {
    const sock = getBaileysSocket();
    if (sock && sock.user) {
      return res.status(200).json({ message: 'Sessão Baileys já está ativa.' });
    }
    await startBaileys();
    res.status(200).json({ message: 'Tentando iniciar sessão Baileys. Verifique o console para o QR Code.' });
  } catch (error: unknown) {
    logger.error('Erro ao iniciar sessão Baileys:', error);
    let errorMessage = 'Erro desconhecido ao iniciar sessão.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: 'Falha ao iniciar sessão.', details: errorMessage });
  }
}

export async function getSessionStatus(req: Request, res: Response) {
  try {
    const sock = getBaileysSocket();
    if (sock && sock.user) {
      res.status(200).json({ status: 'connected', message: 'Sessão Baileys está ativa.' });
    } else {
      res.status(200).json({ status: 'disconnected', message: 'Sessão Baileys não está ativa.' });
    }
  } catch (error: unknown) {
    logger.error('Erro ao obter status da sessão Baileys:', error);
    let errorMessage = 'Erro desconhecido ao obter status da sessão.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: 'Falha ao obter status da sessão.', details: errorMessage });
  }
}

export async function closeSession(req: Request, res: Response) {
  try {
    const sock = getBaileysSocket();
    if (sock && sock.user) {
      await sock.logout();
      res.status(200).json({ message: 'Sessão Baileys encerrada com sucesso.' });
    } else {
      res.status(200).json({ message: 'Nenhuma sessão Baileys ativa para encerrar.' });
    }
  } catch (error: unknown) {
    logger.error('Erro ao encerrar sessão Baileys:', error);
    let errorMessage = 'Erro desconhecido ao encerrar sessão.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: 'Falha ao encerrar sessão.', details: errorMessage });
  }
}


