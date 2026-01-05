import chalk from 'chalk';
import inquirer from 'inquirer';
import open from 'open';
import FtpDeploy from 'ftp-deploy';
import path from 'path';
import { stdout as log } from 'single-line-log';
import process from 'process';
import { execSync } from 'child_process';

const __dirname = path.resolve();

const config = {
  user: 'appier@appier.lesca.net',
  password: 'J}GkX==Q&[Va',
  host: 'ftp.lesca.net',
  port: 21,
  localRoot: __dirname + '/dist',
  remoteRoot: '',
  include: ['*', '**/*'],
  exclude: [],
  deleteRemote: true,
  forcePasv: true,
  sftp: false,
};

const message = {
  question: 'Which app do you want to deploy?',
  executing: 'deploying now...',
  end: 'app was deployed.',
};

const ftpDeploy = new FtpDeploy();

const Uid = (len) => {
  var t = '';
  for (var i = 0; i < len; i++) {
    t += (((1 + Math.random()) * 0x10) | 0).toString(16).substring(1);
  }
  return t;
};

(async () => {
  const list = ['gh-pages', 'netlify', 'netlify-prod', 'ftp'];

  if (list.length) {
    inquirer
      .prompt([
        {
          type: 'select',
          name: 'name',
          message: message.question,
          choices: list,
          filter(val) {
            return val;
          },
        },
      ])
      .then(async (answers) => {
        process.env.NODE_ENV = 'production';
        const id = Uid(10);
        const date = new Date().toISOString().split('T')[0];
        config.remoteRoot = `${date}/${id}`;

        switch (answers.name) {
          case 'gh-pages':
            try {
              execSync('npx gh-pages -d dist', { stdio: 'inherit' });
            } catch (error) {
              console.log(chalk.redBright('gh-pages deploy failed:', error.message));
            }
            break;
          case 'netlify':
            try {
              execSync('netlify deploy --dir=dist', { stdio: 'inherit' });
            } catch (error) {
              console.log(chalk.redBright('Netlify deploy failed:', error.message));
            }
            break;
          case 'netlify-prod':
            try {
              execSync('netlify deploy --prod --dir=dist', { stdio: 'inherit' });
            } catch (error) {
              console.log(chalk.redBright('Netlify deploy failed:', error.message));
            }
            break;

          case 'ftp':
            console.log(chalk.greenBright(`[ ${answers.name} ]`), chalk.white(message.executing));
            ftpDeploy.on('uploaded', function (data) {
              log(
                chalk.greenBright(`[ ${answers.name} ]`),
                chalk.white(
                  `${data.filename} uploaded...(${data.transferredFileCount}/${data.totalFilesCount})`,
                ),
              );
            });
            ftpDeploy.on('uploading', function (data) {
              console.log(
                `Uploading: ${data.filename} (${data.transferredFileCount}/${data.totalFilesCount})`,
              );
            });
            ftpDeploy
              .deploy(config)
              .then(async () => {
                process.stdout.write('\r\x1b[K');
                console.log(chalk.greenBright(`[ ${answers.name} ]`), chalk.white(message.end));
                const url = `https://appier.lesca.net/${date}/${id}/`;
                console.log(
                  chalk.greenBright(`[ ${answers.name} ]`),
                  chalk.green(`preview link added:`),
                  chalk.underline(url),
                );
                await open(url);
              })
              .catch((err) => console.log(err));
        }
      });
  }
})();
