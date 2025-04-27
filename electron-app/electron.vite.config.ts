import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@/shared': resolve('src/shared')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        // '@renderer': resolve('src/renderer/src'),
        '@/components': resolve('src/renderer/src/components'),
        '@/assets': resolve('src/renderer/src/assets'),
        '@/layouts': resolve('src/renderer/src/layouts'),
        '@/hooks': resolve('src/renderer/src/hooks'),
        '@/shared': resolve('src/shared'),
        '@/mocks': resolve('src/renderer/src/mocks')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
