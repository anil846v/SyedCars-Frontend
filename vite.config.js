import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      // SW is registered manually inside AdminLayout — not injected globally
      injectRegister: null,
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.png', 'icons/icon-192.png', 'icons/maskable-512.png'],
      manifest: {
        name: 'Syed Cars',
        short_name: 'SC Admin',
        description: 'Syed Cars Admin Dashboard — manage inventory, sales and enquiries.',
        theme_color: '#FF5A09',
        background_color: '#0D0D0D',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/admin/',
        start_url: '/admin/dashboard',
        categories: ['business', 'productivity'],
      icons: [
  {
    src: 'icons/icon-192.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'any'
  },
  {
    src: 'icons/icon.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any'
  },
  {
    src: 'icons/maskable-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable'
  }
],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        // SPA nav fallback only for admin routes
        navigateFallback: 'index.html',
        navigateFallbackAllowlist: [/^\/admin/],
        runtimeCaching: [
          // Google Fonts stylesheet — cache first, 1 year
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Fonts files — cache first, 1 year
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // NON-AUTH API calls only — network first, 5 min fallback
          // /api/auth/* is intentionally excluded (never cache login/session data)
          {
            urlPattern: /\/api\/(?!auth).*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-responses',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Car images — cache first, 30 days
          {
            urlPattern: /\/uploads\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'car-images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      // // SW only active in dev when explicitly developing — off in production build
      // devOptions: {
      //   enabled: true,
      // },
    }),
  ],
}))
