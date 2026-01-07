import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // CRUCIAL: Makes the build relative so it works on any repo name/subfolder
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});