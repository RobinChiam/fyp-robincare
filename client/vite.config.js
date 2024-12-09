import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/billing': 'http://localhost:5000',
      '/patient': 'http://localhost:5000',
      '/doctor': 'http://localhost:5000',
      '/admin': 'http://localhost:5000',
      '/medical-records': 'http://localhost:5000',
      '/insurance-claims': 'http://localhost:5000',
      '/auth': 'http://localhost:5000',
    },
  },
})
