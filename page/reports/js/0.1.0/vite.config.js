import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: { 
    port: 3122,
    host: true,
    open: true
  },
  build: {
    lib: {
      entry: './index.js',
      name: 'reportsView',
      formats: ['es', 'umd'],
      fileName: (format) => `${componentName}.${format}.js`
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
