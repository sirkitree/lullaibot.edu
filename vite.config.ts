import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Log environment variables during build (without exposing secrets)
console.log('Building with API URL:', process.env.VITE_API_URL || 'Not set')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  // Ensure environment variables are properly replaced at build time
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  }
}) 