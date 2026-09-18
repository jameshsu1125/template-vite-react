import chalk from 'chalk';
import { execFileSync, execSync } from 'child_process';

export const openUrl = (url) => {
  if (!url) return;

  console.log(chalk.green(`opening ${url}`));
  execFileSync('open', [url], { stdio: 'ignore' });
};

export const deployToNetlify = (options) => {
  const output = execSync(`netlify deploy ${options} --json`, {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'inherit'],
  });
  const result = JSON.parse(output);
  if (result.site_name) console.log(chalk.cyan(`Site name: ${result.site_name}`));
  openUrl(result.deploy_url || result.ssl_url || result.url);
};
