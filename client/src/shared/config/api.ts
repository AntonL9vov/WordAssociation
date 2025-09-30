// API configuration for the game client
import { getApiBaseUrl, getWebSocketUrl } from './environment';


export const API_CONFIG = {
  baseUrl: getApiBaseUrl(),
  socketUrl: getWebSocketUrl(),
};
