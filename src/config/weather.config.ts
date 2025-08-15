import { ENV } from './env';

export const OPENWEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export function getOpenWeatherApiKey(): string {
  if (!ENV.OPENWEATHER_API_KEY) {
    throw new Error('OPENWEATHER_API_KEY is not defined in environment variables.');
  }
  return ENV.OPENWEATHER_API_KEY;
}


