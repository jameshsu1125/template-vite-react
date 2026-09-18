import chalk from 'chalk';
import { execFileSync, execSync } from 'child_process';

export const openUrl = (hostname, url) => {
  if (!url) return;

  console.log(chalk.green(`[${hostname}]: ${url}`));
  execFileSync('open', [url], { stdio: 'ignore' });
};

export const deployToNetlify = (options) => {
  const output = execSync(`netlify deploy ${options} --json`, {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'inherit'],
  });
  const result = JSON.parse(output);
  openUrl(result.site_name || 'Netlify', result.deploy_url || result.ssl_url || result.url);
};
