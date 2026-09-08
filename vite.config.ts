import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      includeAssets: ["icon.svg", "icon-192.png", "icon-512.png", "apple-touch-icon.png"],
      manifest: {
        name: "TAKU-Cash",
        short_name: "TAKU-Cash",
        description: "Gestiona tus finanzas personales con TAKU-Cash",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#58cc02",
        background_color: "#58cc02",
        lang: "es",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
    allowedHosts: true,
  },
});
