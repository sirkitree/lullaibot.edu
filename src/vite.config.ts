import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@services': path.resolve(__dirname, './services'),
      '@utils': path.resolve(__dirname, './utils'),
      '@styles': path.resolve(__dirname, './styles'),
      '@pages': path.resolve(__dirname, './pages'),
      '@hooks': path.resolve(__dirname, './hooks'),
      '@assets': path.resolve(__dirname, './assets'),
      '@context': path.resolve(__dirname, './context'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
}); 