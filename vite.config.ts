import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Dopamind/', // Configuração crucial para o GitHub Pages carregar CSS e JS corretamente
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
  }
});