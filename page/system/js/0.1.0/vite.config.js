import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: { 
    port: 3026,
    host: true,
    open: true
  },
  build: {
    lib: {
      entry: './index.js',
      name: 'systemSettings',
      formats: ['es', 'umd'],
      fileName: (format) => `systemSettings.${format}.js`
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
