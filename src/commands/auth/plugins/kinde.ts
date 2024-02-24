import inquirer from 'inquirer';
import colors from 'picocolors';
import { Plugin } from 'types/plugin.js';
import { NPM } from 'utils/package-manager.js';
import templateCopyTransfer from 'utils/template-copy-transfer.js';
import { log, LogLevel, LogColor } from 'utils/logger.js';
import { askOpenPage } from 'utils/ask-open-page.js';

const { bold, cyan } = colors;

const steps = [
    'Enter your project name',
    `Under Region, select ${bold(cyan('USA - Oregon'))}`,
    `Next, select ${bold(cyan('Use Kinde with my existing code base'))}`,
    `Select ${bold(cyan('NextJS'))}`,
    'Toggle how you want to set up your auth / any OAuth logins',
    `Select ${bold(cyan('Connect your NextJS code base'))}`,
];

const kinde: Plugin = {
    install: async () => {
        await askOpenPage('Log in to Kinde then follow steps in this command line', 'https://kinde.com/');
        NPM.install('@kinde-oss/kinde-auth-nextjs');
        await templateCopyTransfer('plugins/kinde', 'src');
        log(`\nAfter logging in, ${bold('follow these steps')} on Kinde to complete setup:`, undefined, LogColor.cyan);
        steps.forEach((step, index) => {
            log(`${index + 1}. ${step}`);
        });
        await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continue',
                message: 'Continue to next steps?',
                default: true,
            },
        ]);
        log(
            `Under ${bold('Quick start')}, a few steps have already been completed for you on behalf of this CLI:`,
            undefined,
            LogColor.green,
            true
        );
        log('npm i @kinde-oss/kinde-auth-nextjs', LogLevel.checkmark);
        log('API endpoint created at src/app/api/auth/[kindeAuth]/route.js', LogLevel.checkmark);
        log(bold('To do:'), LogLevel.warn, LogColor.yellow, true);
        log('- Update env variables in .env.local', undefined, LogColor.yellow);
        log('- Add sign in and sign up buttons to your home page', undefined, LogColor.yellow);

        await inquirer.prompt([
            {
                type: 'confirm',
                name: 'done',
                message: 'Done?',
                default: true,
            },
        ]);
        log('Auth is now set up. It was that easy! 🎉', LogLevel.success, undefined, true);
    },
};

export default kinde;
