import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
      routeFileIgnorePattern: '.*\\.test\\.(ts|tsx)$',
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      '@tanstack/react-router',
      '@tanstack/react-query',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
      'framer-motion',
      'recharts',
      'cmdk',
      'date-fns',
      'sonner',
      'zod',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      '@radix-ui/react-popover',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-progress',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-slot',
    ],
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts'
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('@tanstack/')) return 'vendor-tanstack'
          if (id.includes('@reduxjs/') || id.includes('react-redux') || id.includes('redux')) return 'vendor-redux'
          if (id.includes('@radix-ui/')) return 'vendor-radix'
          if (id.includes('lucide-react')) return 'vendor-icons'
          return undefined
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/router.tsx',
        './src/routes/__root.tsx',
        './src/components/aurix/DashboardShell.tsx',
        './src/features/dashboard/ExecutiveDashboard.tsx',
        './src/redux/store.ts',
      ],
    },
  },
})
