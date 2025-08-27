import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { aliases } from './plugins/aliases';
import { reactRouter } from '@react-router/dev/vite';

export default defineConfig({
  plugins: [
    react(),
    aliases(),
    reactRouter(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});