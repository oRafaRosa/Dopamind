import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path deve corresponder ao nome do repositório para o GitHub Pages
  base: '/Dopamind/', 
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
  }
});