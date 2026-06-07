import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    react(),
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
      external: ["jsonwebtoken"],
      output: {
        manualChunks(id) {
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
          
          // Icons
          if (id.includes("lucide-react")) {
            return "icons";
          }
          
          // Radix UI components - split by component type
          if (id.includes("@radix-ui/react-dialog")) {
            return "radix-dialog";
          }
          if (id.includes("@radix-ui/react-dropdown-menu")) {
            return "radix-dropdown";
          }
          if (id.includes("@radix-ui/react-select")) {
            return "radix-select";
          }
          if (id.includes("@radix-ui/react-tabs")) {
            return "radix-tabs";
          }
          if (id.includes("@radix-ui")) {
            return "ui-vendor";
          }
          
          // Other UI utilities
          if (id.includes("class-variance-authority") || 
              id.includes("clsx") || 
              id.includes("tailwind-merge")) {
            return "ui-utils";
          }
          
          // Form libraries
          if (id.includes("react-hook-form") || id.includes("zod")) {
            return "forms";
          }
          
          // Date libraries
          if (id.includes("date-fns") || id.includes("react-day-picker")) {
            return "date-utils";
          }
          
          // Animation
          if (id.includes("framer-motion")) {
            return "animation";
          }
          
          // Notifications
          if (id.includes("sonner")) {
            return "notifications";
          }
          
          // Other vendors
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
