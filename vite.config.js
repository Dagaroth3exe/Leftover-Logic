import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Local backend port (3000 is often taken by other dev servers, e.g. Next.js).
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
