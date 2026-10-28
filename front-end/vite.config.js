import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Django runs on :8000 in development; Vite forwards API, admin and media requests to it.
const backend = process.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': backend,
      '/media': backend,
      '/admin': backend,
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Keep MUI in its own cacheable chunk.
        manualChunks: { mui: ['@mui/material', '@emotion/react', '@emotion/styled'] },
      },
    },
  },
});
