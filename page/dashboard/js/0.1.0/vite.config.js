import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: { 
    port: 3031,
    host: true,
    open: true
  },
  build: {
    lib: {
      entry: './index.js',
      name: 'userMenu',
      formats: ['es', 'umd'],
      fileName: (format) => `userMenu.${format}.js`
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
