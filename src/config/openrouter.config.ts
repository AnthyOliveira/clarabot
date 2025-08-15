import { ENV } from './env';

export const OPENROUTER_API_BASE_URL = 'https://openrouter.ai/api/v1';

export function getOpenRouterApiKey(): string {
  if (!ENV.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not defined in environment variables.');
  }
  return ENV.OPENROUTER_API_KEY;
}


