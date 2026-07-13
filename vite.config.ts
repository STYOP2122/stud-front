import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages: https://STYOP2122.github.io/stud-front/
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
