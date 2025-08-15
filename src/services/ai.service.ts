import axios from 'axios';
import { OPENROUTER_API_BASE_URL, getOpenRouterApiKey } from '../config/openrouter.config';
import { ENV } from '../config/env';
import { logger } from '../utils/logger';

interface OpenRouterChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function getAiResponse(prompt: string): Promise<string> {
  try {
    const apiKey = getOpenRouterApiKey();
    const response = await axios.post<OpenRouterChatCompletionResponse>(
      `${OPENROUTER_API_BASE_URL}/chat/completions`,
      {
        model: ENV.OPENROUTER_MODEL,
        messages: [
          { role: 'user', content: prompt }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      return 'Não consegui gerar uma resposta inteligente no momento. Tente novamente mais tarde.';
    }
  } catch (error) {
    logger.error('Erro ao obter resposta da IA:', error);
    return 'Ocorreu um erro ao processar sua solicitação de IA. Por favor, tente novamente mais tarde.';
  }
}


