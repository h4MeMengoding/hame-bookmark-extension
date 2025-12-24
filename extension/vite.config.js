import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';

export default defineConfig({
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
        
        // Create icons directory if needed
        try {
          mkdirSync(resolve(__dirname, 'dist/icons'), { recursive: true });
        } catch (e) {
          // Directory already exists
        }
      }
    }
  ],
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
    'process.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'https://api-extension.ilhame.id'
    ),
  },
});
