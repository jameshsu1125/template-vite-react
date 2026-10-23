import { createHash } from 'crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { extname, join, relative, resolve, sep } from 'path';
import { fileURLToPath } from 'url';

export const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '../..');
export const IMAGE_EXTENSIONS = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico'];
export const FONT_EXTENSIONS = ['.woff2', '.woff', '.ttf', '.otf'];
const ASSET_EXTENSIONS = [...IMAGE_EXTENSIONS, ...FONT_EXTENSIONS];

// 靜態資源（圖片、字型）來源資料夾 → CDN 上的根目錄（以資料夾內的相對路徑對應）
const SOURCE_DIRS = [resolve(ROOT, 'src'), resolve(ROOT, 'public')];

export const isAsset = (file) => ASSET_EXTENSIONS.includes(extname(file).toLowerCase());

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

/** 本機檔案絕對路徑 → CDN 上的路徑，例如 components/button/img/skip.svg */
export const toRemotePath = (absFile) => {
  const base = SOURCE_DIRS.find((dir) => absFile.startsWith(dir + sep));
  if (!base) return null;
  return relative(base, absFile).split(sep).join('/');
};

export const hashFile = (absFile) =>
  createHash('sha1').update(readFileSync(absFile)).digest('hex').slice(0, 8);

/**
 * CDN 上的存放資料夾（VITE_CDN_FOLDER），不允許空值或根目錄。
 * 例如 'default' 或 'mcd/2026'
 */
export const normalizeFolder = (folder) => {
  const normalized = (folder || '').trim().replace(/^\/+|\/+$/g, '');
  if (!normalized || normalized.split('/').some((part) => !part || part === '.' || part === '..')) {
    throw new Error('VITE_CDN_FOLDER 必須設定為子資料夾（例如 default），不能上傳到 Bunny 根目錄');
  }
  return normalized;
};

/** 本機檔案絕對路徑 → 完整 CDN URL（附內容 hash 當快取版本） */
export const toCdnUrl = (cdnUrl, folder, absFile) => {
  const remotePath = toRemotePath(absFile);
  if (!remotePath || !existsSync(absFile) || !statSync(absFile).isFile()) return null;
  return `${cdnUrl.replace(/\/+$/, '')}/${folder}/${remotePath}?v=${hashFile(absFile)}`;
};

/** 列出所有要上傳的圖片與字型（remotePath 已含資料夾） */
export const listAssets = (folder) =>
  SOURCE_DIRS.filter(existsSync)
    .flatMap(walk)
    .filter(isAsset)
    .map((localPath) => ({ localPath, remotePath: `${folder}/${toRemotePath(localPath)}` }));
