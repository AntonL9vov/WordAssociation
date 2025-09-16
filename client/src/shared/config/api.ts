// API configuration for the game client
import { getApiBaseUrl, getWebSocketUrl, logEnvironmentConfig } from './environment';

// Log configuration in development
logEnvironmentConfig();

export const API_CONFIG = {
  baseUrl: `${getApiBaseUrl()}/api`, // REST API server
  socketUrl: getApiBaseUrl(), // Socket.IO server
  endpoints: {
    auth: "/auth",
    game: "/game",
    players: "/players",
  },
  wsUrl: getWebSocketUrl(),
};
