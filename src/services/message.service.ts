import { WAMessage, WASocket } from '@whiskeysockets/baileys';
import { logger } from '../utils/logger';
import { getStreamerStatus } from './twitch.service';
import { getCurrentWeather, getWeatherForecast } from './weather.service';
import { getAiResponse } from './ai.service';
import { addUserToQueue } from './queue.service';

export async function processIncomingMessage(sock: WASocket, message: WAMessage) {
  if (!message.message) return;

  const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
  const sender = message.key.remoteJid || '';

  logger.info(`Mensagem recebida de ${sender}: ${text}`);

  const lowerCaseText = text.toLowerCase();

  // Se a mensagem não for um comando, adicione à fila para processamento posterior (ex: IA ou atendimento humano)
  if (!lowerCaseText.startsWith('/twitch') && !lowerCaseText.startsWith('/clima') && !lowerCaseText.startsWith('/previsao') && !lowerCaseText.startsWith('/ia')) {
    addUserToQueue(sock, message);
    return;
  }

  // Se for um comando, processe diretamente
  if (lowerCaseText.startsWith('/twitch')) {
    const streamerName = lowerCaseText.replace('/twitch', '').trim();
    if (streamerName) {
      const status = await getStreamerStatus(streamerName);
      await sock.sendMessage(sender, { text: status });
    } else {
      await sock.sendMessage(sender, { text: 'Por favor, forneça o nome do streamer. Ex: /twitch alanzoka' });
    }
  } else if (lowerCaseText.startsWith('/clima')) {
    const city = lowerCaseText.replace('/clima', '').trim();
    if (city) {
      const weather = await getCurrentWeather(city);
      await sock.sendMessage(sender, { text: weather });
    } else {
      await sock.sendMessage(sender, { text: 'Por favor, forneça o nome da cidade. Ex: /clima São Paulo' });
    }
  } else if (lowerCaseText.startsWith('/previsao')) {
    const city = lowerCaseText.replace('/previsao', '').trim();
    if (city) {
      const forecast = await getWeatherForecast(city);
      await sock.sendMessage(sender, { text: forecast });
    } else {
      await sock.sendMessage(sender, { text: 'Por favor, forneça o nome da cidade para a previsão. Ex: /previsao Rio de Janeiro' });
    }
  } else if (lowerCaseText.startsWith('/ia')) {
    const aiPrompt = lowerCaseText.replace('/ia', '').trim();
    if (aiPrompt) {
      const aiResponse = await getAiResponse(aiPrompt);
      await sock.sendMessage(sender, { text: aiResponse });
    } else {
      await sock.sendMessage(sender, { text: 'Por favor, forneça sua pergunta para a IA. Ex: /ia qual a capital do Brasil?' });
    }
  }
}


