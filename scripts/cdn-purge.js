import chalk from 'chalk';
import { resolve } from 'path';
import { loadEnv } from 'vite';
import { purgeUrls, toPurgeUrl } from './lib/bunny-purge.js';
import { ROOT, normalizeFolder } from './lib/assets.js';

// 用法：npm run cdn:purge                                  清除整個 VITE_CDN_FOLDER 資料夾的快取
//      npm run cdn:purge -- pages/home/img/a.png ...       只清除指定檔案（路徑相對於資料夾）
const env = loadEnv('production', resolve(ROOT, 'src/pages'), ['BUNNY_', 'VITE_CDN_']);
const { BUNNY_API_KEY, VITE_CDN_URL } = env;

if (!BUNNY_API_KEY || !VITE_CDN_URL) {
  console.error(chalk.red('缺少 BUNNY_API_KEY 或 VITE_CDN_URL，請寫在 src/pages/.env.local'));
  process.exit(1);
}

let folder;
try {
  folder = normalizeFolder(env.VITE_CDN_FOLDER);
} catch (error) {
  console.error(chalk.red(error.message));
  process.exit(1);
}

const paths = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
const urls = paths.length
  ? paths.map((path) => toPurgeUrl(VITE_CDN_URL, `${folder}/${path.replace(/^\/+/, '')}`))
  : [toPurgeUrl(VITE_CDN_URL, `${folder}/`)];

const failed = await purgeUrls(BUNNY_API_KEY, urls);
if (failed.length) process.exitCode = 1;
else console.log(chalk.green('\n完成'));
