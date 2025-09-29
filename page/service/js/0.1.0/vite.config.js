import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: { 
    port: 3023,
    host: true,
    open: true
  },
  build: {
    lib: {
      entry: './index.js',
      name: 'serviceMenu',
      formats: ['es', 'umd'],
      fileName: (format) => `serviceMenu.${format}.js`
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
