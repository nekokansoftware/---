import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Tablet opens Vite on the PC:5173; Vite forwards /api to local Java:8000.
// SENSOR_SERVER_TARGET can be set if Java runs on a different machine.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: process.env.SENSOR_SERVER_TARGET || 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
