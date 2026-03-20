import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { join } from "node:path";
import { analyzer } from "vite-bundle-analyzer";
// import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/images": "http://localhost:3000",
      "/movies": "http://localhost:3000",
      "/sounds": "http://localhost:3000",
    },
  },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg"],
  },
  assetsInclude: ["**/*.wasm?binary"],
  publicDir: join(import.meta.dirname, "../public"),
  plugins: [
    analyzer(),
    react(),
    tailwindcss(),
    // babel({
    //   presets: [reactCompilerPreset()]
    // })
  ],
});
