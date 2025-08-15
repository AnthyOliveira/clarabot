import { Whatsapp } from '@wppconnect-team/wppconnect';
import { logger } from '../utils/logger';
import { getStreamerStatus } from './twitch.service';
import { getCurrentWeather, getWeatherForecast } from './weather.service';
import { getAiResponse } from './ai.service';
import { addUserToQueue, UserStatus, getUserStatus } from './queue.service';

export async function processIncomingMessage(client: Whatsapp, message: any) {
  logger.info(`Mensagem recebida de ${message.from}: ${message.body}`);

  const text = message.body.toLowerCase();
  const userId = message.from;

  // Se a mensagem não for um comando, adicione à fila para processamento posterior (ex: IA ou atendimento humano)
  if (!text.startsWith('/twitch') && !text.startsWith('/clima') && !text.startsWith('/previsao') && !text.startsWith('/ia')) {
    addUserToQueue(client, message);
    return;
  }

  // Se for um comando, processe diretamente
  if (text.startsWith('/twitch')) {
    const streamerName = text.replace('/twitch', '').trim();
    if (streamerName) {
      const status = await getStreamerStatus(streamerName);
      await client.sendText(message.from, status);
    } else {
      await client.sendText(message.from, 'Por favor, forneça o nome do streamer. Ex: /twitch alanzoka');
    }
  } else if (text.startsWith('/clima')) {
    const city = text.replace('/clima', '').trim();
    if (city) {
      const weather = await getCurrentWeather(city);
      await client.sendText(message.from, weather);
    } else {
      await client.sendText(message.from, 'Por favor, forneça o nome da cidade. Ex: /clima São Paulo');
    }
  } else if (text.startsWith('/previsao')) {
    const city = text.replace('/previsao', '').trim();
    if (city) {
      const forecast = await getWeatherForecast(city);
      await client.sendText(message.from, forecast);
    } else {
      await client.sendText(message.from, 'Por favor, forneça o nome da cidade para a previsão. Ex: /previsao Rio de Janeiro');
    }
  } else if (text.startsWith('/ia')) {
    const aiPrompt = text.replace('/ia', '').trim();
    if (aiPrompt) {
      const aiResponse = await getAiResponse(aiPrompt);
      await client.sendText(message.from, aiResponse);
    } else {
      await client.sendText(message.from, 'Por favor, forneça sua pergunta para a IA. Ex: /ia qual a capital do Brasil?');
    }
  }
}


