import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';

  return {
    root: '.',
    base: '/',
    publicDir: 'public',

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },

    server: {
      port: 3000,
      host: true,
      strictPort: false,
      open: false,
      cors: true,
      hmr: {
        overlay: true,
      },
    },

    preview: {
      port: 4173,
      host: true,
      strictPort: false,
      open: false,
    },

    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isProduction ? true : false,
      minify: isProduction ? 'terser' : false,
      cssMinify: isProduction,
      
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
        },
        format: {
          comments: false,
        },
      } : undefined,

      rollupOptions: {
        output: {
          manualChunks: undefined,
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/woff|woff2|eot|ttf|otf/.test(ext)) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            if (/css/.test(ext)) {
              return 'assets/css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },

      reportCompressedSize: true,
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
    },

    css: {
      postcss: './postcss.config.js',
      devSourcemap: isDevelopment,
    },

    optimizeDeps: {
      include: [],
      exclude: [],
    },

    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },

    logLevel: 'info',
  };
});