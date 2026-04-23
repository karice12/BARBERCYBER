import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    hmr: process.env.DISABLE_HMR !== 'true',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      ignored: [
        '**/.local/**',
        '**/server/**',
        '**/.git/**',
        '**/node_modules/**',
        '**/.cache/**',
      ],
    },
  },
});
