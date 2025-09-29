import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: { 
    port: 3017,
    host: true,
    open: true
  },
  build: {
    lib: {
      entry: './index.js',
      name: 'pageTemplate',
      formats: ['es', 'umd'],
      fileName: (format) => `pageTemplate.${format}.js`
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
