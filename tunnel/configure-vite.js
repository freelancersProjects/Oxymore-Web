const fs = require('fs');
const path = require('path');

function configureViteForTunnel(projectPath, ngrokHost) {
  const viteConfigPath = path.join(projectPath, 'vite.config.ts');
  
  let viteConfig;
  if (projectPath.includes('oxymore-app')) {
    viteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,
    cors: true,
    allowedHosts: ["${ngrokHost}", "localhost", "127.0.0.1"]
  }
});
`;
  } else {
    viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,
    cors: true,
    allowedHosts: ["${ngrokHost}", "localhost", "127.0.0.1"]
  }
});
`;
  }
  
  fs.writeFileSync(viteConfigPath, viteConfig);
  console.log(`✅ Configured ${projectPath}/vite.config.ts for ngrok host: ${ngrokHost}`);
}

function extractHostFromUrl(tunnelUrl) {
  try {
    const url = new URL(tunnelUrl);
    return url.hostname;
  } catch (error) {
    console.error('Error extracting host from URL:', error);
    return null;
  }
}

module.exports = {
  configureViteForTunnel,
  extractHostFromUrl
}; 
 
 