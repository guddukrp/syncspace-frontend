import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,        // change to any port you want
    strictPort: true,  // optional (fails if port is already used)
  },
})