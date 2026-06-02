import { defineConfig } from '@lovable.dev/vite-tanstack-config';

export default defineConfig({
  nitro: {
    preset: 'cloudflare',
  },
  vite: {
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    ssr: {
      external: ['jsonwebtoken'],
    },
    build: {
      rollupOptions: {
        external: ['jsonwebtoken'],
      },
    },
  },
});
