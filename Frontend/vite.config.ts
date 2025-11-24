import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// Fix for __dirname in ESM modules (since package.json has "type": "module")
const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Only include assets that actually exist in your public folder to avoid 404 errors
      includeAssets: ['02.2__1_-removebg-preview.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      devOptions: {
        enabled: true // Enable PWA in development mode
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/index.html', // Essential for React Router offline support
        cleanupOutdatedCaches: true
      },
      manifest: {
        name: 'Hikma Finance',
        short_name: 'Hikma',
        description: 'Finance management app for students and admins',
        theme_color: '#ffffff',
        background_color: '#ffffff', // Required for PWA installability
        display: 'standalone',       // Required for PWA installability
        start_url: '/',              // Required for PWA installability
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Helpful for Android adaptive icons
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 2500,
  },
})