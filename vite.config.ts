import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: "/",
  server: {
    proxy: {
      '/api': {
        target: 'https://16.171.14.210:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  }
});
