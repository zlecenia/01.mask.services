import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: { 
    port: 3013,
    host: true,
    open: true
  },
  build: {
    lib: {
      entry: './index.js',
      name: 'loginForm',
      formats: ['es', 'umd'],
      fileName: (format) => `loginForm.${format}.js`
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
