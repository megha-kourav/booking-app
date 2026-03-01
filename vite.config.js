import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Booking App',
        short_name: 'Booking',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/small.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/biglogo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
