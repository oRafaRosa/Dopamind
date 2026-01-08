import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Usar './' torna os caminhos relativos, funcionando em qualquer subdiretório ou nome de repo
  base: './', 
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
  }
});