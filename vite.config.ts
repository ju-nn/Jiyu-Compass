import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages deployment: set VITE_BASE_URL env var to '/<repo-name>/'
const base = process.env.VITE_BASE_URL ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'ジユウノコンパス - 生活コンパス診断',
        short_name: 'ジユウノコンパス',
        description: '働きすぎない暮らしに近づくために、お金と時間の余力を整理する生活設計ツール',
        theme_color: '#059669',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts'],
          'icons-vendor': ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts', 'lucide-react']
  }
})
