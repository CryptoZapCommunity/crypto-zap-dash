import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  root: ".",
  server: {
    port: 3000,
    host: true,
    // Removido o proxy - agora fazemos chamadas diretas
  },
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['wouter'],
          query: ['@tanstack/react-query'],
          ui: [
            '@radix-ui/react-accordion', 
            '@radix-ui/react-alert-dialog', 
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu'
          ],
          charts: ['chart.js', 'recharts'],
          icons: ['lucide-react', 'react-icons'],
                      forms: ['react-hook-form'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority', 'date-fns']
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'wouter', 
      '@tanstack/react-query',
      'lucide-react',
      'clsx',
      'tailwind-merge'
    ],
  },
  esbuild: {
    target: 'es2020',
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
});
