import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "./app/assets/builds", // Saída nesta pasta
    emptyOutDir: true, // Esvaziar a pasta de saída antes do build
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
