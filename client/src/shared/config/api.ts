// API configuration for the game client
export const API_CONFIG = {
  baseUrl: 'http://localhost:3001/api', // REST API сервер
  socketUrl: 'http://localhost:3000', // Socket.IO сервер
  endpoints: {
    auth: '/auth',
    game: '/game',
    players: '/players',
  },
  wsUrl: import.meta.env.PROD
    ? import.meta.env.VITE_API_WS_URL_PROD
    : import.meta.env.VITE_API_WS_URL_DEV
};
