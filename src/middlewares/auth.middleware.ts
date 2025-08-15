import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';
import { logger } from '../utils/logger';

export function authenticateWebhook(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Tentativa de acesso não autorizado ao webhook: Token não fornecido.');
    return res.status(401).json({ error: 'Não autorizado: Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  if (token === ENV.WEBHOOK_SECRET) {
    next();
  } else {
    logger.warn('Tentativa de acesso não autorizado ao webhook: Token inválido.');
    return res.status(403).json({ error: 'Acesso proibido: Token de autenticação inválido.' });
  }
}


