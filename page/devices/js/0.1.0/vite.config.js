import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: { 
    port: 3010,
    host: true,
    open: true
  },
  build: {
    lib: {
      entry: './index.js',
      name: 'deviceSelect',
      formats: ['es', 'umd'],
      fileName: (format) => `deviceSelect.${format}.js`
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
