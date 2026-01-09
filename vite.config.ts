import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Define a base URL correta para o GitHub Pages baseado no nome do repositório
  base: '/Dopamind/', 
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
});