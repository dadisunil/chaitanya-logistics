import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const DJANGO_BASE_URL = process.env.VITE_DJANGO_BASE_URL || 'http://13.200.120.112:8000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': DJANGO_BASE_URL,
    },
  },
});
