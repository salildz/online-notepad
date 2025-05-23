import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '../env',
  server: {
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://server:9001',
        /*         changeOrigin: true,
                secure: false,
                ws: true, */
      },
    },
    allowedHosts: ["notepad.yildizsalih.com"],
  },
})
