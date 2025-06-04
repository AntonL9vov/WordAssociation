// API configuration for the game client
export const API_CONFIG = {
  baseUrl: import.meta.env.PROD 
    ? import.meta.env.VITE_API_BASE_URL_PROD 
    : import.meta.env.VITE_API_BASE_URL_DEV,
  endpoints: {
    auth: '/auth',
    game: '/game',
    players: '/players',
  },
  wsUrl: import.meta.env.PROD
    ? import.meta.env.VITE_API_WS_URL_PROD
    : import.meta.env.VITE_API_WS_URL_DEV
};
