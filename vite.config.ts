import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src/frontend',
  build: {
    outDir: '../../dist',
  },
  server: {
    port: 3000,
    proxy: {
      '/walrus-publisher': {
        target: 'https://publisher.walrus-testnet.walrus.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/walrus-publisher/, ''),
      },
      '/walrus-aggregator': {
        target: 'https://aggregator.walrus-testnet.walrus.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/walrus-aggregator/, ''),
      },
    },
  },
});
