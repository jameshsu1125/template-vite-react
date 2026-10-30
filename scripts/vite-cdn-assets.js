import { isAsset, toCdnUrl } from './lib/assets.js';

/**
 * 在 TS／TSX 裡 import 的資源檔（音檔、圖片、字型）改成 Bunny CDN 網址。
 * 例如 import bgm from './mp3/mp3-bgm.mp3' 在 cdn 模式會拿到 https://<CDN>/<folder>/.../mp3-bgm.mp3?v=hash，
 * local 模式則交回 Vite 原本的處理（打包到 dist/assets）。
 * CSS 內的 url() 由 postcss-cdn-url 處理，這裡不會碰到。
 */
const viteCdnAssets = ({ enabled, cdnUrl, folder }) => ({
  name: 'vite-cdn-assets',
  enforce: 'pre',
  load(id) {
    // 帶查詢參數的匯入（?url、?raw、?inline…）與虛擬模組交回 Vite
    if (!enabled || id.startsWith('\0') || id.includes('?') || !isAsset(id)) return null;

    const url = toCdnUrl(cdnUrl, folder, id);
    if (!url) {
      this.warn(`找不到檔案，保留本機路徑：${id}`);
      return null;
    }
    return `export default ${JSON.stringify(url)};`;
  },
});

export default viteCdnAssets;
