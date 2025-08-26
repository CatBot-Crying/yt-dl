import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ตรวจสอบว่าโมดูลที่ import เข้ามา มาจากโฟลเดอร์ node_modules หรือไม่
          if (id.includes('node_modules')) {
            // ถ้าใช่, ให้จับกลุ่มโมดูลทั้งหมดที่มาจาก node_modules
            // ไปไว้ในไฟล์ chunk เดียวที่ชื่อว่า 'vendor'
            return 'vendor';
          }
        },
      },
    },
  },
})
