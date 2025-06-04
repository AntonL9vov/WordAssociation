import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@widgets': '/src/widgets',
      '@pages': '/src/pages',
      '@app': '/src/app',
      '@shared': '/src/shared',
      '@entities': '/src/entities',
      '@features': '/src/features'
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]__[hash:base64:5]'
    }
  }
});
