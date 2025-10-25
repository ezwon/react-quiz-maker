import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      api: path.resolve(__dirname, './src/api'),
      theme: path.resolve(__dirname, './src/theme'),
      features: path.resolve(__dirname, './src/features'),
      contexts: path.resolve(__dirname, './src/contexts'),
      components: path.resolve(__dirname, './src/components'),
      services: path.resolve(__dirname, './src/services'),
      hooks: path.resolve(__dirname, './src/hooks'),
      utils: path.resolve(__dirname, './src/utils'),
      types: path.resolve(__dirname, './src/types'),
      images: path.resolve(__dirname, './src/images'),
    },
  },
});
