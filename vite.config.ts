import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    react(),
    // FASE 0: Performance Baseline - Bundle Analyzer
    visualizer({
      open: true,
      filename: './dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== "true",
    // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
    watch: process.env.DISABLE_HMR === "true" ? null : {},
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ["jsonwebtoken", "express", "uuid", "crypto", "fs", "path", "os", "net", "tls", "http", "https", "stream"],
      output: {
        manualChunks(id) {
          // Sprint 1: Separar rotas públicas de admin
          // Mover componentes compartilhados para chunk separado
          if (id.includes("/components/")) {
            return "shared-components";
          }
          
          if (id.includes("/routes/_app/")) {
            return "admin-routes";
          }
          
          if (id.includes("/routes/office/")) {
            return "office-routes";
          }
          
          // Rotas públicas
          if (id.includes("/routes/") && !id.includes("/routes/_app/") && !id.includes("/routes/office/")) {
            return "public-routes";
          }
          
          // React core
          if (id.includes("react") && !id.includes("@radix-ui")) {
            return "react-vendor";
          }
          
          // TanStack Query
          if (id.includes("@tanstack")) {
            return "tanstack-query";
          }
          
          // Supabase
          if (id.includes("@supabase")) {
            return "supabase";
          }
          
          // Icons - keep with react-vendor to avoid circular dependencies
          if (id.includes("lucide-react")) {
            return "react-vendor";
          }
          
          // Radix UI components
          if (id.includes("@radix-ui")) {
            return "ui-vendor";
          }
          
          // Other UI utilities
          if (id.includes("class-variance-authority") || 
              id.includes("clsx") || 
              id.includes("tailwind-merge")) {
            return "ui-utils";
          }
          
          // Other vendors
          if (id.includes("sonner") || 
              id.includes("framer-motion") || 
              id.includes("date-fns") ||
              id.includes("react-day-picker") ||
              id.includes("react-hook-form") ||
              id.includes("zod")) {
            return "vendor";
          }
        },
      },
    },
  },
});
