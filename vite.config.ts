import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Usa caminho relativo para garantir que funcione na raiz ou em subpastas sem quebrar os imports
  base: './', 
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
});