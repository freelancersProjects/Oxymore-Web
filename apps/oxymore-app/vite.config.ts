import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,
    cors: true,
    allowedHosts: ["41e6d9d51957.ngrok-free.app", "localhost", "127.0.0.1"]
  }
});
