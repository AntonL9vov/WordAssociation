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

  console.log("Environment:", ENV_CONFIG, import.meta.env.VITE_API_BASE_URL_DEV, import.meta.env.VITE_API_BASE_URL_PROD )
  
  if (ENV_CONFIG.isDevelopment) {
    return devUrl || 'http://localhost:3000';
  }
  
  // In production, use relative paths for reverse proxy setup
  return prodUrl || window.location.origin;
};

export const getWebSocketUrl = (): string => {
  const devUrl = import.meta.env.VITE_API_WS_URL_DEV;
  const prodUrl = import.meta.env.VITE_API_WS_URL_PROD;
  
  if (ENV_CONFIG.isDevelopment) {
    return devUrl || 'ws://localhost:3000';
  }
  
  // In production, use WebSocket with same origin (will be proxied)
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return prodUrl || `${protocol}//${window.location.host}`;
};

// Get API base path for production routing
export const getApiBasePath = (): string => {
  return ENV_CONFIG.isProduction ? '' : ''; // No additional path prefix needed
};

// Get WebSocket path for production routing
export const getWebSocketPath = (): string => {
  return ENV_CONFIG.isProduction ? '/ws' : '';
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
      apiBasePath: getApiBasePath(),
      websocketPath: getWebSocketPath(),
    });
  }
};