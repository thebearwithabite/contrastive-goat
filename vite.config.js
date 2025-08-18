import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: use the repo subpath for GitHub Pages
export default defineConfig({
  base: process.env.VITE_BASE || '/',   // <-- we'll set VITE_BASE in CI
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: 'dist' }
})