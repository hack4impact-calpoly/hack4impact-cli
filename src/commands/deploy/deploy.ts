import inquirer from 'inquirer';
import colors from 'picocolors';
import open from 'open';
import { readConfig } from 'utils/read-config-file';
import { validateGitHubStatus } from 'utils/check-git';

const deploymentOptions = [
    {
        name: 'Vercel',
        url: 'https://vercel.com/new',
    },
    {
        name: 'AWS Amplify',
        url: 'https://console.aws.amazon.com/amplify/home',
    },
];

/**
 * Initializes a new project by prompting the user for a project name and a GitHub template.
 */
export async function deploy() {
    const config = readConfig();

    if (!config || !config.projectPath) {
        return;
    }
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'target',
                message: 'Choose your deployment target:',
                choices: deploymentOptions.map((option) => option.name),
            },
        ])
        .then(async (answers) => {
            try {
                await validateGitHubStatus();
                const selectedOption = deploymentOptions.find((option) => option.name === answers.target);
                // console.log(`Deploying to ${selectedOption.name}...`);
                if (selectedOption) askOpenPage(selectedOption.name, selectedOption.url);
            } catch (error) {
                console.error('Failed to deploy project:', error);
            }
        })
        .catch((error) => {
            console.error('Failed to prompt:', error);
        });
}

async function askOpenPage(name: string, url: string) {
    const { cyan } = colors;
    const answers = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'continue',
            message: `\nLog in to ${name} to deploy your project: ${cyan(url)}\nOpen page now?`,
            default: true,
        },
    ]);
    if (!answers.continue) {
        process.exit(1);
    }
    open(url);
}
