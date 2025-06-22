import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    cors: {
      origin:
        "https://6a50-2a01-e0a-5fa-36a0-d3-ff0d-5f4f-36aa.ngrok-free.app/",
      credentials: true,
    },
    allowedHosts: ["ece6-2a01-e0a-5fa-36a0-4cbf-49c4-7fce-9328.ngrok-free.app"],
  },
});
