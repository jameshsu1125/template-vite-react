import chalk from 'chalk';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import process from 'process';

const message = {
  question: 'Which app do you want to deploy?',
  executing: 'deploying now...',
  end: 'app was deployed.',
};

(async () => {
  const list = ['gh-pages', 'netlify-draft', 'netlify-prod'];

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
        switch (answers.name) {
          case 'gh-pages':
            try {
              execSync('npx gh-pages -d dist', { stdio: 'inherit' });
            } catch (error) {
              console.log(chalk.redBright('gh-pages deploy failed:', error.message));
            }
            break;
          case 'netlify-draft':
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
        }
      });
  }
})();
