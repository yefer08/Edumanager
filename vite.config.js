import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('firebase') || id.includes('@firebase')) {
            return 'firebase'
          }
        }
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
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