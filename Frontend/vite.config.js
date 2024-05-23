import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: process.env.PORT || 5173, // Use the port provided by Render or default to 5173
    proxy: {
      '/api': {
        target: 'https://mern-blog-backend-ten-xi.vercel.app',
        secure: false
      }
    }
  },
  plugins: [react()]
})
