import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';

const DEFAULT_API = 'http://188.166.248.22:3001';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';
  const apiUrl = process.env.VITE_API_URL || (isDev ? '' : DEFAULT_API);

  return {
    plugins: [
      react(),
      {
        name: 'copy-manifest',
        closeBundle() {
          // Copy manifest.json to dist
          copyFileSync(
            resolve(__dirname, 'manifest.json'),
            resolve(__dirname, 'dist/manifest.json')
          );
          // Copy background service worker to dist so manifest can load it
          try {
            copyFileSync(
              resolve(__dirname, 'background.js'),
              resolve(__dirname, 'dist/background.js')
            );
          } catch (e) {
            // ignore if missing
          }

          // Create icons directory if needed
          try {
            mkdirSync(resolve(__dirname, 'dist/icons'), { recursive: true });
          } catch (e) {
            // Directory already exists
          }
        }
      }
    ],
    server: isDev
      ? {
          proxy: {
            '/api': {
              target: DEFAULT_API,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'index.html'),
        },
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
  };
});
