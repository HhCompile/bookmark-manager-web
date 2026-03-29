import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ViteCodeInspectorPlugin } from '@code-inspector/vite';

// Use import.meta.url to resolve paths in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      // Code Inspector plugin (must come before react plugin)
      ViteCodeInspectorPlugin({
        output: 'html',
        bundler: 'esbuild',
      }),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            ui: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
            ],
            charts: ['recharts'],
            icons: ['lucide-react'],
            utils: ['date-fns', 'clsx', 'tailwind-merge'],
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'lucide-react',
        'clsx',
        'tailwind-merge',
        'date-fns',
      ],
    },
  };
});
