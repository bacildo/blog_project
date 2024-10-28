import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [react(), eslint()],
  build: {
    outDir: "./app/assets/builds",
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0", 
    port: 3001,
    proxy: {
      "/blog_project": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true, 
    },
  },
});
