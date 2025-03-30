import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '../env',
  server: {
    proxy: {
      '/api': {
        target: 'http://server:6001',
        /*         changeOrigin: true,
                secure: false,
                ws: true, */
      },
    },
  },
})
