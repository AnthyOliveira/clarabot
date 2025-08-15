import axios from 'axios';
import { ENV } from './env';
import { logger } from '../utils/logger';

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let twitchAccessToken: string | null = null;
let tokenExpiryTime: number | null = null;

export async function getTwitchAccessToken(): Promise<string> {
  if (twitchAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return twitchAccessToken;
  }

  try {
    const response = await axios.post<TwitchTokenResponse>(
      `https://id.twitch.tv/oauth2/token`,
      new URLSearchParams({
        client_id: ENV.TWITCH_CLIENT_ID,
        client_secret: ENV.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    twitchAccessToken = response.data.access_token;
    tokenExpiryTime = Date.now() + response.data.expires_in * 1000 - 60000; // 1 minute buffer
    logger.info('Twitch access token obtained successfully.');
    return twitchAccessToken;
  } catch (error) {
    logger.error('Error obtaining Twitch access token:', error);
    throw new Error('Failed to obtain Twitch access token.');
  }
}


