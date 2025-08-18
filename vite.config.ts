import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    },
    allowedHosts: [
      '.e2b.dev',
      'localhost',
      '127.0.0.1'
    ]
  },
})