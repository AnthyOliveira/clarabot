import axios from 'axios';
import { OPENWEATHER_API_BASE_URL, getOpenWeatherApiKey } from '../config/weather.config';
import { logger } from '../utils/logger';

interface WeatherResponse {
  weather: Array<{ description: string; icon: string }>;
  main: { temp: number; feels_like: number; temp_min: number; temp_max: number; humidity: number };
  name: string;
  sys: { country: string };
}

interface ForecastResponse {
  list: Array<{
    dt: number;
    main: { temp: number; feels_like: number; temp_min: number; temp_max: number; humidity: number };
    weather: Array<{ description: string; icon: string }>;
    dt_txt: string;
  }>;
  city: { name: string; country: string };
}

export async function getCurrentWeather(city: string): Promise<string> {
  try {
    const apiKey = getOpenWeatherApiKey();
    const response = await axios.get<WeatherResponse>(
      `${OPENWEATHER_API_BASE_URL}/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
    );

    const { name, sys, main, weather } = response.data;
    const description = weather[0].description;
    const temp = main.temp.toFixed(1);
    const feelsLike = main.feels_like.toFixed(1);
    const humidity = main.humidity;

    return `Clima atual em ${name}, ${sys.country}: ${description}. Temperatura: ${temp}°C (sensação de ${feelsLike}°C). Umidade: ${humidity}%.`;
  } catch (error) {
    logger.error(`Erro ao obter clima para ${city}:`, error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return `Não foi possível encontrar a cidade ${city}. Por favor, verifique o nome e tente novamente.`;
    }
    return `Não foi possível obter o clima para ${city}. Por favor, tente novamente mais tarde.`;
  }
}

export async function getWeatherForecast(city: string): Promise<string> {
  try {
    const apiKey = getOpenWeatherApiKey();
    const response = await axios.get<ForecastResponse>(
      `${OPENWEATHER_API_BASE_URL}/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
    );

    const forecastList = response.data.list.filter((item) => item.dt_txt.includes("12:00:00")); // Get forecast for noon each day
    let forecastMessage = `Previsão do tempo para ${response.data.city.name}, ${response.data.city.country}:\n\n`;

    for (const item of forecastList) {
      const date = new Date(item.dt * 1000).toLocaleDateString("pt-BR");
      const description = item.weather[0].description;
      const temp = item.main.temp.toFixed(1);
      forecastMessage += `${date}: ${description}. Temp: ${temp}°C.\n`;
    }

    return forecastMessage;
  } catch (error) {
    logger.error(`Erro ao obter previsão do tempo para ${city}:`, error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return `Não foi possível encontrar a cidade ${city}. Por favor, verifique o nome e tente novamente.`;
    }
    return `Não foi possível obter a previsão do tempo para ${city}. Por favor, tente novamente mais tarde.`;
  }
}


