import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '/api-mock': path.resolve(__dirname, './src/api-mock')
    }
  },
  server: {
    // For local dev, API routes are not available via Vite dev server
    // They will be handled by Vercel serverless functions in production
  }
});
