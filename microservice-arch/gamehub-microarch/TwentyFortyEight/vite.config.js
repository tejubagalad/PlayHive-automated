import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 2048 game served at /2048/
export default defineConfig({
  base: '/2048/',
  plugins: [react()],
})
