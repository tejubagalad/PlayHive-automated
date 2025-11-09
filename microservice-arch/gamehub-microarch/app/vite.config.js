import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GameHub served at root path
export default defineConfig({
  base: '/',
  plugins: [react()],
})
