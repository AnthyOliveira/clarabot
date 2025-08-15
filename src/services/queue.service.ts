import { Whatsapp } from '@wppconnect-team/wppconnect';
import { logger } from '../utils/logger';
import { processIncomingMessage } from './message.service';

enum UserStatus {
  IDLE = 'idle',
  IN_QUEUE = 'in_queue',
  IN_CHAT = 'in_chat',
}

interface QueueMessage {
  client: Whatsapp;
  message: any;
}

const messageQueue: QueueMessage[] = [];
const userStatuses: Map<string, UserStatus> = new Map();

export function addUserToQueue(client: Whatsapp, message: any) {
  const userId = message.from;
  if (!userStatuses.has(userId) || userStatuses.get(userId) === UserStatus.IDLE) {
    userStatuses.set(userId, UserStatus.IN_QUEUE);
    messageQueue.push({ client, message });
    logger.info(`Usuário ${userId} adicionado à fila. Tamanho da fila: ${messageQueue.length}`);
    processQueue();
  } else {
    logger.info(`Usuário ${userId} já está na fila ou em atendimento.`);
    client.sendText(userId, 'Sua mensagem já está na fila ou você já está em atendimento. Por favor, aguarde.');
  }
}

async function processQueue() {
  if (messageQueue.length === 0) {
    return;
  }

  const nextMessage = messageQueue[0];
  const userId = nextMessage.message.from;

  if (userStatuses.get(userId) === UserStatus.IN_QUEUE) {
    userStatuses.set(userId, UserStatus.IN_CHAT);
    logger.info(`Processando mensagem do usuário ${userId}.`);
    await processIncomingMessage(nextMessage.client, nextMessage.message);
    messageQueue.shift(); // Remove a mensagem da fila após o processamento
    userStatuses.set(userId, UserStatus.IDLE); // Define o status como ocioso após o processamento
    logger.info(`Mensagem do usuário ${userId} processada. Tamanho da fila restante: ${messageQueue.length}`);
    processQueue(); // Processa a próxima mensagem na fila
  }
}

export function getUserStatus(userId: string): UserStatus {
  return userStatuses.get(userId) || UserStatus.IDLE;
}

export function setUserStatus(userId: string, status: UserStatus) {
  userStatuses.set(userId, status);
}

export { UserStatus };


