import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Dopamind/', // CRUCIAL: Must match your GitHub repository name
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});