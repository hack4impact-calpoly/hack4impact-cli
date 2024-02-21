import inquirer from 'inquirer';
import { Plugin } from 'types/plugin';
import { NPM } from 'utils/package-manager';
import { validateGitHubStatus } from 'utils/check-git';
import open from 'open';
import colors from 'picocolors';

// MongoDB with Mongoose ORM
const mongoose: Plugin = {
    install: (packageJsonAdditions) => {
        NPM.install('mongoose');

        // Prompt user to go to mongoDB website to set up project
        try {
            validateGitHubStatus();
            // const selectedOption = deploymentOptions.find((option) => option.name === answers.target);
            // console.log(`Deploying to ${selectedOption.name}...`);
            askOpenPage('MongoDB', 'https://www.mongodb.com/cloud/atlas/register');
        } catch (error) {
            console.error('Failed to deploy project:', error);
        }

        // Prompt user for & add to url .env
        console.log(
            'Log in to your MongoDB Atlas account and copy the connection string, which can be found under “Connect” > “Connecting with MongoDB for VS Code.”'
        );
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'url',
                    message: 'Enter your MongoDB connection URL:',
                    validate: (input) => {
                        if (input.length === 0) {
                            return 'MongoDB connection URL cannot be empty.';
                        }
                        return true;
                    },
                },
            ])
            .then((answers) => {
                let url = answers.url;
                // If "<password>" is in the URL, replace it with the actual password by prompting the user
                if (url.includes('<password>')) {
                    console.log(
                        'Please enter the password for your MongoDB database user. You can find this on the left navigation bar “Security” > “Database Access.”'
                    );
                    inquirer
                        .prompt([
                            {
                                type: 'password',
                                name: 'password',
                                message: 'Enter your database user password:',
                                validate: (input) => {
                                    if (input.length === 0) {
                                        return 'Database user password cannot be empty.';
                                    }
                                    return true;
                                },
                            },
                        ])
                        .then((answers) => {
                            url = url.replace('<password>', answers.password);
                            packageJsonAdditions.env = { MONGODB_URL: url };
                        });
                } else {
                    packageJsonAdditions.env = { MONGODB_URL: answers.url };
                }
            });
    },
};

function askOpenPage(name: string, url: string) {
    const { cyan } = colors;
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'continue',
                message: `\nLog in to ${name} to connect your project: ${cyan(url)}\nOpen page now?`,
                default: true,
            },
        ])
        .then((answers) => {
            if (!answers.continue) {
                process.exit(1);
            }
            open(url);
        });
}

export default mongoose;
