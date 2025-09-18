// Environment configuration utilities
export const ENV_CONFIG = {
  // Check if running in development mode
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development' || import.meta.env.DEV,
  
  // Check if running in production mode
  isProduction: import.meta.env.VITE_NODE_ENV === 'production' || import.meta.env.PROD,
  
  // Get current environment
  environment: import.meta.env.VITE_NODE_ENV || (import.meta.env.DEV ? 'development' : 'production'),
} as const;

// Environment variable getters with fallbacks
export const getApiBaseUrl = (): string => {
  const devUrl = import.meta.env.VITE_API_BASE_URL_DEV;
  const prodUrl = import.meta.env.VITE_API_BASE_URL_PROD;
  
  if (ENV_CONFIG.isDevelopment) {
    return devUrl || 'http://localhost:3000';
  }
  
  return prodUrl || 'http://localhost:3000';
};

export const getWebSocketUrl = (): string => {
  const devUrl = import.meta.env.VITE_API_WS_URL_DEV;
  const prodUrl = import.meta.env.VITE_API_WS_URL_PROD;
  
  if (ENV_CONFIG.isDevelopment) {
    return devUrl || 'ws://localhost:3000';
  }
  
  return prodUrl || 'wss://localhost/ws';
};

// Log current configuration (for debugging)
export const logEnvironmentConfig = () => {
  if (ENV_CONFIG.isDevelopment) {
    console.log('🔧 Environment Configuration:', {
      environment: ENV_CONFIG.environment,
      isDevelopment: ENV_CONFIG.isDevelopment,
      isProduction: ENV_CONFIG.isProduction,
      apiBaseUrl: getApiBaseUrl(),
      websocketUrl: getWebSocketUrl(),
    });
  }
};