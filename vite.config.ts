import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ถ้ามีการเรียก API ไปที่ /api ให้ส่งต่อไปยัง PHP server
      '/api': {
        target: 'http://alone-value.atwebpages.com', // หรือ URL ของ PHP server ของคุณ เช่น http://localhost:8080
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
