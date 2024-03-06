import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Serve static files from the 'dist' directory
    fs: {
      strict: false,
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/utils/testSetup.js'],
    globals: true
  }
})
