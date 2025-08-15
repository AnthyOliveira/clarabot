import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '3000',
  WPPCONNECT_SESSION_NAME: process.env.WPPCONNECT_SESSION_NAME || 'bot-session',
  TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID || '',
  TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET || '',
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || '',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct',
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || 'supersecretkey',
};


