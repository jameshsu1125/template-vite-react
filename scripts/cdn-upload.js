import chalk from 'chalk';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import SftpClient from 'ssh2-sftp-client';
import { loadEnv } from 'vite';
import { purgeUrls, toPurgeUrl } from './lib/bunny-purge.js';
import { ROOT, hashFile, listAssets, normalizeFolder } from './lib/assets.js';

// 用法：npm run cdn:upload            只上傳有變動的圖片、字型與音檔，上傳後自動清除這些檔案的 CDN 快取
//      npm run cdn:upload -- --force  全部重新上傳
const force = process.argv.includes('--force');
const MANIFEST = resolve(ROOT, 'scripts/.cdn-manifest.json');

const env = loadEnv('production', resolve(ROOT, 'src/pages'), ['BUNNY_', 'VITE_CDN_']);
const { BUNNY_STORAGE_ZONE, BUNNY_STORAGE_PASSWORD, BUNNY_API_KEY, VITE_CDN_URL } = env;
const BUNNY_SFTP_HOST = env.BUNNY_SFTP_HOST || 'storage.bunnycdn.com';

if (!BUNNY_STORAGE_ZONE || !BUNNY_STORAGE_PASSWORD) {
  console.error(
    chalk.red('缺少 BUNNY_STORAGE_ZONE 或 BUNNY_STORAGE_PASSWORD，請寫在 src/pages/.env.local'),
  );
  process.exit(1);
}

let folder;
try {
  folder = normalizeFolder(env.VITE_CDN_FOLDER);
} catch (error) {
  console.error(chalk.red(error.message));
  process.exit(1);
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
const assets = listAssets(folder);
const pending = assets.filter(
  ({ localPath, remotePath }) => force || manifest[remotePath] !== hashFile(localPath),
);

console.log(
  chalk.cyan(`上傳到 /${folder}/，共 ${assets.length} 個檔案，需上傳 ${pending.length} 個`),
);
if (pending.length === 0) process.exit(0);

const sftp = new SftpClient();
const failed = [];
const uploaded = [];

try {
  await sftp.connect({
    host: BUNNY_SFTP_HOST,
    port: 22,
    username: BUNNY_STORAGE_ZONE,
    password: BUNNY_STORAGE_PASSWORD,
  });

  const createdDirs = new Set();
  for (const { localPath, remotePath } of pending) {
    const target = `/${remotePath}`;
    const dir = dirname(target);
    try {
      if (dir !== '/' && !createdDirs.has(dir)) {
        if (!(await sftp.exists(dir))) await sftp.mkdir(dir, true);
        createdDirs.add(dir);
      }
      await sftp.put(localPath, target);
      manifest[remotePath] = hashFile(localPath);
      uploaded.push(remotePath);
      console.log(chalk.green(`  ✓ ${remotePath}`));
    } catch (error) {
      failed.push(remotePath);
      console.log(chalk.red(`  ✗ ${remotePath}: ${error.message}`));
    }
  }
} catch (error) {
  console.error(chalk.red(`SFTP 連線失敗：${error.message}`));
  if (/authentication/i.test(error.message)) {
    console.error(
      chalk.yellow(
        `請確認 BUNNY_SFTP_HOST（${BUNNY_SFTP_HOST}）符合 storage zone 的主要區域，例如 sg.storage.bunnycdn.com`,
      ),
    );
  }
  process.exitCode = 1;
} finally {
  await sftp.end().catch(() => {});
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
}

if (failed.length) {
  console.log(chalk.red(`\n${failed.length} 個上傳失敗：\n${failed.join('\n')}`));
  process.exitCode = 1;
} else if (!process.exitCode) {
  console.log(chalk.green(`\n完成，已上傳 ${pending.length} 個`));
}

// 同名檔案覆蓋後，CDN 仍會送出舊快取，所以清掉剛上傳檔案的快取
if (uploaded.length) {
  if (!BUNNY_API_KEY || !VITE_CDN_URL) {
    console.log(
      chalk.yellow('\n未設定 BUNNY_API_KEY 或 VITE_CDN_URL，略過清除快取；覆蓋的檔案可能仍顯示舊版'),
    );
  } else {
    console.log(chalk.cyan(`\n清除 ${uploaded.length} 個檔案的 CDN 快取`));
    const purgeFailed = await purgeUrls(
      BUNNY_API_KEY,
      uploaded.map((remotePath) => toPurgeUrl(VITE_CDN_URL, remotePath)),
    );
    if (purgeFailed.length) {
      console.log(chalk.red(`${purgeFailed.length} 個清除失敗，可執行 npm run cdn:purge 重試`));
      process.exitCode = 1;
    }
  }
}
