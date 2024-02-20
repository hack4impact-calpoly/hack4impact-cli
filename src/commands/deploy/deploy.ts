import inquirer from 'inquirer';
import colors from 'picocolors';
import open from 'open';
import { readConfig } from 'utils/read-config-file';
import { isGitRepository, hasRemote, hasUnpushedChanges } from 'utils/check-git';

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

async function validateGitHubStatus() {
    const { red, yellow } = colors;
    if (!isGitRepository()) {
        console.error(red('Error: This directory is not a Git repository. Did you mean to run: hack4impact-cli init'));
        process.exit(1);
    }
    if (!hasRemote()) {
        console.error(red('Error: This Git repository does not have a remote.'));
        console.error(
            'Please create a new repository in your GitHub organization.\nFirst create a repository in your GitHub organization, then\ngit remote add origin https://github.com/YourOrganizationName/YourRepositoryName.git'
        );
        process.exit(1);
    }
    if (hasUnpushedChanges(true)) {
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
