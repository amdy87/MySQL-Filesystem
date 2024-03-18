import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.MYFILESYSTEM_BACKEND_HOST': JSON.stringify(
        env.MYFILESYSTEM_BACKEND_HOST,
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@api': path.resolve(__dirname, './src/api'),
      },
    },
    server: {
      // Serve static files from the 'dist' directory
      fs: {
        strict: false,
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/utils/testSetup.js'],
      globals: true,
    },
  };
});
