import chalk from 'chalk';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import SftpClient from 'ssh2-sftp-client';
import { loadEnv } from 'vite';
import { ROOT, hashFile, listAssets, normalizeFolder } from './lib/assets.js';

// 用法：npm run cdn:upload            只上傳有變動的圖片與字型
//      npm run cdn:upload -- --force  全部重新上傳
const force = process.argv.includes('--force');
const MANIFEST = resolve(ROOT, 'scripts/.cdn-manifest.json');

const env = loadEnv('production', resolve(ROOT, 'src/pages'), ['BUNNY_', 'VITE_CDN_']);
const { BUNNY_STORAGE_ZONE, BUNNY_STORAGE_PASSWORD } = env;
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
