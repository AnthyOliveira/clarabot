import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error(`Erro: ${err.message}`, err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: 'Ocorreu um erro interno no servidor.',
    details: err.message,
  });
}


