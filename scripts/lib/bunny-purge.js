import chalk from 'chalk';

const PURGE_API = 'https://api.bunny.net/purge';

/** CDN 上的路徑 → 清除快取用的網址；結尾 * 會一併清掉同一檔案帶不同 ?v= 的快取 */
export const toPurgeUrl = (cdnUrl, remotePath) => `${cdnUrl.replace(/\/+$/, '')}/${remotePath}*`;

/** 清除單一網址的快取（需要 Bunny 帳號的 API key，不是儲存區域密碼） */
const purgeUrl = async (apiKey, url) => {
  const res = await fetch(`${PURGE_API}?url=${encodeURIComponent(url)}&async=false`, {
    method: 'POST',
    headers: { AccessKey: apiKey },
  });
  if (res.ok) return;
  const hint = res.status === 401 ? '（BUNNY_API_KEY 錯誤，請用帳號的 API key）' : '';
  throw new Error(`HTTP ${res.status}${hint}`);
};

/** 依序清除多個網址的快取，回傳失敗的網址 */
export const purgeUrls = async (apiKey, urls) => {
  const failed = [];
  for (const url of urls) {
    try {
      await purgeUrl(apiKey, url);
      console.log(chalk.green(`  ✓ 已清除 ${url}`));
    } catch (error) {
      failed.push(url);
      console.log(chalk.red(`  ✗ ${url}: ${error.message}`));
    }
  }
  return failed;
};
