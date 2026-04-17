import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/cs11-minesweeper-react-2026/',
  plugins: [react()],
})
