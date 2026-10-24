import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Absolute base matching the proxy sub-path. The browser reaches the app at
  // /proxy/5173/ and that prefix is preserved by code-server, so assets must be
  // emitted as /proxy/5173/assets/... (absolute, no duplication).
  base: '/proxy/5173/',
  server: {
    // Listen on all interfaces so the dev server is reachable from outside
    // the container / remote environment (not just localhost inside it).
    host: '0.0.0.0',
    port: 5173,
    // Allow any host header so the remote port-forwarding hostname is accepted.
    allowedHosts: true,
  },
  preview: {
    // Same settings for `vite preview` (static production build served under
    // the proxy). This is the reliable path behind code-server forwarding.
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
})
