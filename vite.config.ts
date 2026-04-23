import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  // Carregar env vars de múltiplas fontes
  const env = loadEnv(mode, '.', '');
  const vercelEnv = loadEnv(mode, '/vercel/share', '');
  
  // Stripe publishable key (pode vir de NEXT_PUBLIC_ ou STRIPE_)
  const stripePublishableKey = 
    vercelEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
    vercelEnv.STRIPE_PUBLISHABLE_KEY ||
    env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
    env.STRIPE_PUBLISHABLE_KEY || 
    '';
  
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || vercelEnv.GEMINI_API_KEY),
      'process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': JSON.stringify(stripePublishableKey),
      'import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(stripePublishableKey),
    },
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
  };
});
