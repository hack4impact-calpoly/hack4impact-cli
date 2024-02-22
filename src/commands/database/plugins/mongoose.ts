import inquirer from 'inquirer';
import { Plugin } from 'types/plugin';
import { NPM } from 'utils/package-manager';
import { validateGitHubStatus } from 'utils/check-git';
import open from 'open';
import colors from 'picocolors';
import writeToEnv from 'utils/write-to-env';

// MongoDB with Mongoose ORM
const mongoose: Plugin = {
    install: async () => {
        const { cyan } = colors;
        try {
            await validateGitHubStatus();
            NPM.install('mongoose');

            // Prompt user to go to mongoDB website to set up project
            await askOpenPage('MongoDB', 'https://www.mongodb.com/cloud/atlas/register');
            // Prompt user for & add to url .env
            console.log(
                cyan(
                    '\nLog in to your MongoDB Atlas account and copy the connection string, which can be found under:\n“Connect” > “Connecting with MongoDB for VS Code.”'
                )
            );
            const resUrl = await inquirer.prompt([
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
            ]);
            let url = resUrl.url;
            // If "<password>" is in the URL, replace it with the actual password by prompting the user
            if (url.includes('<password>')) {
                console.log(
                    cyan(
                        '\nPlease enter the password for your MongoDB database user. You can find this on the left navigation bar:\n“Security” > “Database Access.”'
                    )
                );
                const resPw = await inquirer.prompt([
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
                ]);
                url = url.replace('<password>', resPw.password);
            }
            // Add the MONDODB_URL to the user's .env.local file
            writeToEnv('MONGODB_URL', url);
        } catch (error) {
            console.error('Failed to set up database for project:', error);
        }
    },
};

async function askOpenPage(name: string, url: string) {
    const { cyan } = colors;
    const res = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'continue',
            message: `\nLog in to ${name} to connect your project: ${cyan(url)}\nOpen page now?`,
            default: true,
        },
    ]);
    if (!res.continue) {
        process.exit(1);
    }
    open(url);
}

export default mongoose;
