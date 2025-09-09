// API configuration for the game client
export const API_CONFIG = {
  baseUrl: 'http://localhost:3000/api', // REST API server (unified with socket)
  socketUrl: 'http://localhost:3000', // Socket.IO server (unified)
  endpoints: {
    auth: '/auth',
    game: '/game',
    players: '/players',
  },
  wsUrl: import.meta.env.PROD
    ? import.meta.env.VITE_API_WS_URL_PROD
    : import.meta.env.VITE_API_WS_URL_DEV
};
