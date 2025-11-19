import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'   // optional, but handy
import { defineConfig as defineVitestConfig } from 'vitest/config'

// use defineVitestConfig so "test" is a known property
export default defineVitestConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: [...configDefaults.exclude, 'e2e/**']
  }
})
