export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL;
};

export const getWebSocketUrl = (): string => {
  return import.meta.env.VITE_API_WS_URL;
};
