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

  console.log(output);
  openUrl(result.deploy_url || result.ssl_url || result.url);
};
