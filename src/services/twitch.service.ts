import axios from 'axios';
import { getTwitchAccessToken } from '../config/twitch.config';
import { ENV } from '../config/env';
import { logger } from '../utils/logger';

interface TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

interface TwitchStreamsResponse {
  data: TwitchStream[];
}

export async function getStreamerStatus(streamerLogin: string): Promise<string> {
  try {
    const accessToken = await getTwitchAccessToken();
    const response = await axios.get<TwitchStreamsResponse>(
      `https://api.twitch.tv/helix/streams?user_login=${streamerLogin}`,
      {
        headers: {
          'Client-ID': ENV.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.data.length > 0) {
      const stream = response.data.data[0];
      return `O streamer ${stream.user_name} está ONLINE! Título: ${stream.title}. Jogo: ${stream.game_name}. Espectadores: ${stream.viewer_count}. Link: https://www.twitch.tv/${stream.user_login}`;
    } else {
      return `O streamer ${streamerLogin} está OFFLINE.`;
    }
  } catch (error) {
    logger.error(`Erro ao verificar status do streamer ${streamerLogin}:`, error);
    return `Não foi possível verificar o status do streamer ${streamerLogin}. Por favor, tente novamente mais tarde.`;
  }
}


