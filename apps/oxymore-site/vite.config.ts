import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    cors: {
      origin: 'https://6a50-2a01-e0a-5fa-36a0-d3-ff0d-5f4f-36aa.ngrok-free.app/',
      credentials: true,
    },
    allowedHosts: ['6a50-2a01-e0a-5fa-36a0-d3-ff0d-5f4f-36aa.ngrok-free.app'],
  },
})
