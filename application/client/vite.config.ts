import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { join } from "node:path";
// import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  publicDir: join(import.meta.dirname, "../public"),
  plugins: [
    react(),
    tailwindcss(),
    // babel({
    //   presets: [reactCompilerPreset()]
    // })
  ],
});
