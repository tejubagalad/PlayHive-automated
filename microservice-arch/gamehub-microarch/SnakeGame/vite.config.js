import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Snake game served at /snake/
export default defineConfig({
  base: '/snake/',
  plugins: [react()],
})
