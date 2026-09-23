import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    svelte({
      preprocess: vitePreprocess({ script: true }), // ensure TS preprocessing
    }),
  ],
  base: "./", // Ensures relative paths in the build
  resolve: {
    alias: {
      // svelte-splitpanes (used by GridSplitpanes) imports the SvelteKit-only
      // $app/environment module; this demo isn't a SvelteKit app, so shim it.
      "$app/environment": resolve(__dirname, "src/app-environment-shim.ts"),
    },
  },
  optimizeDeps: {
    exclude: ["svelte-splitpanes"],
  },
  build: {
    outDir: "dist", // Output directory for build artifacts
    rollupOptions: {
      input: "index.html", // Adjusted to match the file structure
    },
  },
  server: {
    port: 3000,
  },
});
