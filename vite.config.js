import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In local dev, /api/jobs is proxied straight to the public Arbeitnow API.
// On Vercel, /api/jobs is served by the serverless function in /api/jobs.js.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/jobs": {
        target: "https://www.arbeitnow.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/jobs/, "/api/job-board-api"),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: { output: { manualChunks: { charts: ["recharts"] } } },
  },
  test: { environment: "node" },
});
