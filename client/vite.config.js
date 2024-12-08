import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Proxy API requests
      '/billing': 'http://localhost:5000', // Proxy API requests
      '/patient': 'http://localhost:5000', // Proxy API requests  
      '/doctor': 'http://localhost:5000', // Proxy API requests
      '/admin': 'http://localhost:5000', // Proxy API requests
      '/medical-records': 'http://localhost:5000', // Proxy API requests
      '/insurance-claims': 'http://localhost:5000', // Proxy API requests
      '/auth': 'http://localhost:5000', // Proxy API requests
    },
  },
})
