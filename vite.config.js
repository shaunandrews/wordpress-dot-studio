import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'dot-grid',
        },
      },
    }),
  ],
  root: 'web-root',
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    open: false
  }
});
