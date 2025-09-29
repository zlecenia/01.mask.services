import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: { 
    port: 3028,
    host: true,
    open: true
  },
  build: {
    lib: {
      entry: './index.js',
      name: 'testMenu',
      formats: ['es', 'umd'],
      fileName: (format) => `testMenu.${format}.js`
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
