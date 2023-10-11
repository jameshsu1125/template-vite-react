import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: './',
    root: resolve(__dirname, 'src/pages'),
    publicDir: resolve(__dirname, 'public'),
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/pages/index.html'),
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          math: 'always',
          globalVars: {
            mainColor: 'red',
          },
        },
      },
    },
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: 'a',
            description: 'v',
            url: 'c',
            facebookID: 'a',
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };
});
