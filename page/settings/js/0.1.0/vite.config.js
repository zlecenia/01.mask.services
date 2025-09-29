import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: { 
    port: 3030,
    host: true,
    open: true
  },
  build: {
    lib: {
      entry: './index.js',
      name: 'userData',
      formats: ['es', 'umd'],
      fileName: (format) => `userData.${format}.js`
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
