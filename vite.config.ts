import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    emptyOutDir: true,
    // Split vendor chunks so browsers can cache them separately
    rollupOptions: {
      output: {
        manualChunks: {
          // Heavy animation library — cache-busted independently
          'vendor-framer': ['framer-motion'],
          // GSAP animation suite — cached separately
          'vendor-gsap': ['gsap', '@gsap/react'],
          // Icon library — large but rarely changes
          'vendor-lucide': ['lucide-react'],
          // React core — almost never changes
          'vendor-react': ['react', 'react-dom'],
        },
      },
    },
    // Warn when any chunk exceeds 400KB (before split)
    chunkSizeWarningLimit: 400,
  },
})
