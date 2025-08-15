import { Request, Response } from 'express';
import { startWppConnect, client } from '../config/wppconnect.config';
import { logger } from '../utils/logger';

export async function startSession(req: Request, res: Response) {
  try {
    if (client && await client.isConnected()) {
      return res.status(200).json({ message: 'Sessão WPPConnect já está ativa.' });
    }
    await startWppConnect();
    res.status(200).json({ message: 'Tentando iniciar sessão WPPConnect. Verifique o console para o QR Code.' });
  } catch (error: unknown) {
    logger.error('Erro ao iniciar sessão WPPConnect:', error);
    let errorMessage = 'Erro desconhecido ao iniciar sessão.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: 'Falha ao iniciar sessão.', details: errorMessage });
  }
}

export async function getSessionStatus(req: Request, res: Response) {
  try {
    if (client && await client.isConnected()) {
      res.status(200).json({ status: 'connected', message: 'Sessão WPPConnect está ativa.' });
    } else {
      res.status(200).json({ status: 'disconnected', message: 'Sessão WPPConnect não está ativa.' });
    }
  } catch (error: unknown) {
    logger.error('Erro ao obter status da sessão WPPConnect:', error);
    let errorMessage = 'Erro desconhecido ao obter status da sessão.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: 'Falha ao obter status da sessão.', details: errorMessage });
  }
}

export async function closeSession(req: Request, res: Response) {
  try {
    if (client && await client.isConnected()) {
      await client.close();
      res.status(200).json({ message: 'Sessão WPPConnect encerrada com sucesso.' });
    } else {
      res.status(200).json({ message: 'Nenhuma sessão WPPConnect ativa para encerrar.' });
    }
  } catch (error: unknown) {
    logger.error('Erro ao encerrar sessão WPPConnect:', error);
    let errorMessage = 'Erro desconhecido ao encerrar sessão.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: 'Falha ao encerrar sessão.', details: errorMessage });
  }
}


