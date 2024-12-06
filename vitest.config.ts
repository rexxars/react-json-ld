/// <reference types="vitest" />
import {defineConfig} from 'vite'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest-setup.js'],
  },
})
