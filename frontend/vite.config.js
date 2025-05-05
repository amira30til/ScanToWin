import path from "path";
import { defineConfig } from "vite";
// eslint-disable-next-line import/default
import react from "@vitejs/plugin-react";

export default defineConfig((mode) => {
  return {
    plugins: [react()],
    server: {
      watch: {
        usePolling: true,
      },
      host: true,
      port: 5173,
      strictPort: true,
      hmr: {
        clientPort: parseInt(5173),
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Improved build configuration
      sourcemap: mode !== "production", // Only generate sourcemaps in development
      chunkSizeWarningLimit: 1000, // Increase warning limit for larger chunks
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor code into separate chunks
            vendor: ["react", "react-dom", "react-router-dom"],
          },
        },
      },
    },
  };
});
