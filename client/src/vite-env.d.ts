/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL_PROD: string;
  readonly VITE_API_BASE_URL_DEV: string;
  readonly VITE_API_WS_URL_PROD: string;
  readonly VITE_API_WS_URL_DEV: string;
  readonly VITE_ENV: string;
  readonly VITE_NODE_ENV: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
