import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de un navegador real para Vitest Browser Mode (Playwright, sin ventana)
const browser = (name) => ({
  extends: true,
  test: {
    name,
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [{ browser: name }],
    },
  },
})

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      // Necesario para detectar cambios de archivos montados en Docker
      usePolling: true,
    },
  },
  test: {
    globals: true,
    setupFiles: './src/test/setup.js',
    // Cada proyecto corre las mismas pruebas en un entorno distinto. Se elige con --project:
    //   unit     → jsdom (rápido, sin navegador): npm test, npm run test:coverage
    //   chromium → Chromium real: npm run test:chrome
    //   firefox  → Firefox real: npm run test:firefox
    projects: [
      { extends: true, test: { name: 'unit', environment: 'jsdom' } },
      browser('chromium'),
      browser('firefox'),
    ],
  },
})
