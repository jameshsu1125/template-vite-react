import chalk from 'chalk';
import { execFileSync, spawn } from 'child_process';

export const openUrl = (hostname, url) => {
  if (!url) return;

  console.log(chalk.green(`[${hostname}]: ${url}`));
  execFileSync('open', [url], { stdio: 'ignore' });
};

export const deployToNetlify = (options) =>
  new Promise((resolve, reject) => {
    const child = spawn('netlify', ['deploy', ...options], {
      stdio: ['inherit', 'pipe', 'inherit'],
    });
    let output = '';

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      output += chunk;
      process.stdout.write(chunk);
    });

    child.on('error', reject);
    child.on('close', (code, signal) => {
      if (code !== 0) {
        const reason = signal ? `was terminated by ${signal}` : `exited with code ${code}`;
        reject(new Error(`Netlify deploy ${reason}`));
        return;
      }

      const match = output.match(/(?:Draft URL|Unique deploy URL):\s*<?(https?:\/\/[^\s>]+)/);
      if (!match) {
        reject(new Error('Could not find the deploy URL in Netlify output.'));
        return;
      }

      const deployUrl = match[1];
      const hostname = new URL(deployUrl).hostname;
      const siteName = hostname.endsWith('.netlify.app')
        ? hostname.slice(0, -'.netlify.app'.length).split('--').at(-1)
        : 'Netlify';

      try {
        openUrl(siteName || 'Netlify', deployUrl);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
