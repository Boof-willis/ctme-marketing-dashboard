import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/windsor': {
        target: 'https://connectors.windsor.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/windsor/, ''),
      },
      '/api/ghl': {
        target: 'https://services.leadconnectorhq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ghl/, ''),
      },
    },
  },
})
