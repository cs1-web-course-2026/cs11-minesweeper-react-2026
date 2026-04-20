import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/cs11-minesweeper-react-2026/' : '/',
  plugins: [react()],
}))
