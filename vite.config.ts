import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  base: "./", // Ensures relative paths in the build
  build: {
    outDir: "dist", // Output directory for build artifacts
    rollupOptions: {
      input: "index.html", // Adjusted to match the file structure
    },
  },
});
