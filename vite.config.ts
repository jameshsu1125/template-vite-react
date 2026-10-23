import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import mkcert from 'vite-plugin-mkcert';
import { normalizeFolder } from './scripts/lib/assets.js';
import postcssCdnUrl from './scripts/postcss-cdn-url.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, './src/pages');

  // 圖片、字型來源開關：VITE_IMAGE_SOURCE=local | cdn（設定在 src/pages/.env.local）
  const useCdn = env.VITE_IMAGE_SOURCE === 'cdn';
  const cdnUrl = (env.VITE_CDN_URL || '').replace(/\/+$/, '');
  if (useCdn && !cdnUrl) throw new Error('VITE_IMAGE_SOURCE=cdn 需要設定 VITE_CDN_URL');
  const cdnFolder = useCdn ? normalizeFolder(env.VITE_CDN_FOLDER) : '';
  const alias = { '@': resolve(__dirname, 'src') };

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
      postcss: {
        plugins: [tailwindcss(), postcssCdnUrl({ enabled: useCdn, cdnUrl, folder: cdnFolder, alias })],
      },
      preprocessorOptions: {
        less: {
          math: 'always',
          globalVars: {},
        },
      },
    },
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: env.VITE_TITLE,
            description: env.VITE_SUBSCRIPTION,
            url: env.VITE_URL,
            facebookID: env.VITE_FACEBOOK_ID,
            imageBase: useCdn ? `${cdnUrl}/${cdnFolder}/` : '',
          },
        },
      }),
      mkcert(),
    ],
    resolve: {
      alias,
    },
    server: {
      open: true,
      port: 5173,
      proxy: {
        '/api': 'http://localhost:3000',
      },
    },
  };
});
