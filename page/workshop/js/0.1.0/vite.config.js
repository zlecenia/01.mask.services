import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: { 
    port: 3034,
    host: true,
    open: true
  },
  build: {
    lib: {
      entry: './index.js',
      name: 'workshop',
      formats: ['es', 'umd'],
      fileName: (format) => `workshop.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"development"'
  }
});
