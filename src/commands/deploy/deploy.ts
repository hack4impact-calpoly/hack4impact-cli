import inquirer from 'inquirer';
import colors from 'picocolors';
import open from 'open';
import { readConfig } from 'utils/read-config-file';
import { isGitRepository, hasRemote, hasUnpushedChanges } from 'utils/check-git';

/**
 * Initializes a new project by prompting the user for a project name and a GitHub template.
 */

export async function deploy() {
    const config = readConfig();
    const { cyan } = colors;

    if (!config || !config.projectPath) {
        return;
    }
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'target',
                message: 'Choose your deployment target:',
                choices: [
                    'Vercel',
                    // 'AWS' // TODO
                ],
            },
        ])
        .then(async (answers) => {
            try {
                await validateGitHubStatus();
                // console.log(`Deploying to ${answers.target}...`);
                if (answers.target === 'Vercel') {
                    const vercelUrl = 'https://vercel.com/new';
                    const answers = await inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'continue',
                            message: `\nLog in to Vercel to deploy your project: ${cyan(vercelUrl)}\nOpen page now?`,
                            default: true,
                        },
                    ]);
                    if (!answers.continue) {
                        process.exit(1);
                    }
                    open(vercelUrl);
                }
            } catch (error) {
                console.error('Failed to deploy project:', error);
            }
        })
        .catch((error) => {
            console.error('Failed to prompt:', error);
        });
}

async function validateGitHubStatus() {
    if (!isGitRepository()) {
        console.error('This directory is not a Git repository.');
        process.exit(1);
    }
    if (!hasRemote()) {
        console.error('This Git repository does not have a remote.');
        process.exit(1);
    }
    if (hasUnpushedChanges(true)) {
        const { yellow } = colors;
        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continue',
                message: "You have uncommitted changes that won't be reflected in the deployment. Continue?",
                default: false,
                prefix: yellow('⚠️'),
            },
        ]);
        if (!answers.continue) {
            process.exit(1);
        }
    }
}
