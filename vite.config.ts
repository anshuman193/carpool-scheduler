import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(rootDir, './src/components'),
      '@hooks': path.resolve(rootDir, './src/hooks'),
      '@types': path.resolve(rootDir, './src/types'),
      '@utils': path.resolve(rootDir, './src/utils'),
      '@styles': path.resolve(rootDir, './src/styles'),
      '@store': path.resolve(rootDir, './src/store'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
