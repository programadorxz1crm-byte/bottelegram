import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite conexiones externas
    allowedHosts: ['.trycloudflare.com'], // Permite todos los subdominios de Cloudflare
  },
});
