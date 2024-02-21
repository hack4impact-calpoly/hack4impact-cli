// Assuming other imports are already here
import inquirer from 'inquirer';
import { readConfig } from 'utils/read-config-file';
import { NPM } from 'utils/package-manager';

/**
 * Adds a database to the project by prompting the user to select a database option.
 */
export async function addDatabase() {
    const config = readConfig();

    if (!config || !config.projectPath) {
        return;
    }

    const dbOptions = [
        { name: 'MongoDB', value: 'mongodb' },
        { name: 'Other / I will set up the database myself', value: 'other' },
        /* TODO
        // { name: 'MySQL', value: 'mysql' },
        // { name: 'PostgreSQL', value: 'postgresql' },
        */
    ];

    try {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'database',
                message: 'Choose a database for your project:',
                choices: dbOptions.map((db) => db.name),
            },
        ]);

        const selectedOption = dbOptions.find((db) => db.name === answers.database);
        if (!selectedOption) {
            console.error('Invalid database selection.');
            return;
        }

        await setupDatabase(selectedOption.value, config.projectPath);
        console.log(`Setting up ${selectedOption.name} for your project...`);
    } catch (error) {
        console.error('Failed to add database:', error);
    }
}

async function setupDatabase(database: string, projectPath: string) {
    let packageToInstall = '';
    switch (database) {
        case 'mongodb':
            packageToInstall = 'mongoose';
            break;
        /* TODO
        // case 'mysql':
        //     packageToInstall = 'mysql2'; // or 'sequelize' for an ORM approach
        //     break;
        // case 'postgresql':
        //     packageToInstall = 'pg'; // or 'sequelize' for an ORM approach
        //     break;
        */
    }
    if (packageToInstall) {
        try {
            console.log(`Installing ${packageToInstall} in ${projectPath}...`);
            NPM.install(packageToInstall);
            console.log(`${packageToInstall} installed successfully.`);
        } catch (error) {
            console.error(`Error installing ${packageToInstall}:`, error);
        }
    } else {
        console.log('No database package specified for installation.');
    }
}
