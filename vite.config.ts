import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

import postcss from "./cfg/postcss.config.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  css: {postcss},

  // prevent vite from obscuring rust errors
  clearScreen: false,

  build: {
    target: ["es2021", "chrome100", "safari13"],
    // don't minify for debug builds
    minify: !process.env.DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.DEBUG,
    chunkSizeWarningLimit: 1000,
  },
});
