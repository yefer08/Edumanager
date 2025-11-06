import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    rollupOptions: {
      plugins: [
        commonjs({
          include: /node_modules/,
          transformMixedEsModules: true
        })
      ],
      output: {
        manualChunks: (id) => {
          if (id.includes('firebase') || id.includes('@firebase')) {
            return 'firebase'
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'firebase/app', 
      'firebase/auth', 
      'firebase/firestore'
    ],
    esbuildOptions: {
      target: 'esnext'
    }
  }
})