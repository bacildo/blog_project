import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "./app/assets/builds", 
    emptyOutDir: true, 
  },
  server: {
    port: 3001,
    proxy: {
      "/blog_project": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
