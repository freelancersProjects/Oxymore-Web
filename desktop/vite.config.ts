import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';
import { copyFileSync, existsSync } from 'fs';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

// Plugin pour copier le preload.js en CommonJS
const copyPreloadPlugin = () => ({
  name: 'copy-preload',
  buildStart() {
    if (existsSync('electron/preload.js')) {
      copyFileSync('electron/preload.js', 'dist-electron/preload.js');
    }
  },
  handleHotUpdate() {
    if (existsSync('electron/preload.js')) {
      copyFileSync('electron/preload.js', 'dist-electron/preload.js');
    }
  },
});

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    copyPreloadPlugin(),
    electron([
      {
        entry: 'electron/main.ts',
      },
    ]),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@oxymore/ui': resolve(__dirname, '../packages/oxm-ui/src'),
      '@oxymore/types': resolve(__dirname, '../packages/types/src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: true,
    cors: true,
  },
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        splash: resolve(__dirname, 'splash.html'),
      },
    },
  },
  publicDir: 'public',
});

