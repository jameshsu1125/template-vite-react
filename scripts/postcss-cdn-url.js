import { dirname, resolve } from 'path';
import { isAsset, toCdnUrl } from './lib/assets.js';

const URL_PATTERN = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;

/**
 * 把 CSS 內指向本機圖片、字型的 url() 改成 Bunny CDN 網址。
 * Less 原始碼不用改，image-width()/image-height() 照樣在編譯時讀本機檔案。
 */
const postcssCdnUrl = ({ enabled, cdnUrl, folder, alias = {} }) => ({
  postcssPlugin: 'postcss-cdn-url',
  Declaration(decl) {
    if (!enabled || !decl.value.includes('url(')) return;
    const from = decl.source?.input.file;

    decl.value = decl.value.replace(URL_PATTERN, (match, quote, url) => {
      if (/^(data:|https?:|\/\/|#)/.test(url) || !isAsset(url.split(/[?#]/)[0])) return match;

      const path = url.split(/[?#]/)[0];
      const aliasKey = Object.keys(alias).find((key) => path.startsWith(`${key}/`));
      const absFile = aliasKey
        ? resolve(alias[aliasKey], path.slice(aliasKey.length + 1))
        : from && resolve(dirname(from), path);

      const cdn = absFile && toCdnUrl(cdnUrl, folder, absFile);
      if (!cdn) {
        console.warn(`[postcss-cdn-url] 找不到檔案，保留本機路徑：${url} (${from})`);
        return match;
      }
      return `url('${cdn}')`;
    });
  },
});
postcssCdnUrl.postcss = true;

export default postcssCdnUrl;
