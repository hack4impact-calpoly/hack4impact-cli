#!/usr/bin/env node

import { program } from 'commander';
import initProject from './commands/init/init.js';
import addDatabase from './commands/database/database.js';
import deploy from './commands/deploy/deploy.js';
import { hack4ImpactRcExists } from 'utils/read-config-file.js';
import checkIfAnyDirectoryExists from 'utils/check-directory.js';
import colors from 'picocolors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fs } from 'fs';
import path from 'path';

program.name('hack4impact-cli').description('CLI to initialize and set up volunteer management systems');

const { green } = colors;
// Only show init command if .hack4impactrc does not exist
if (!hack4ImpactRcExists()) {
    program.command('init').description('Initialize a new volunteer management project').action(initProject.execute);
    // Case for if they created a project but haven't cd into it yet
    // If a directory exists, add help text to the end of message to remind them to cd into the project directory
    if (checkIfAnyDirectoryExists()) {
        program.addHelpText(
            'after',
            `\n${green(`* If you've already initialized a project, make sure to cd into the project directory before running any other commands.`)}\n`
        );
    }
} else {
    // Only show rest of commands if .hack4impactrc exists
    program.command('deploy').description('Deploy the project').action(deploy.execute);
    program.command('database').description('Add a database to the project').action(addDatabase.execute);
    program
        .command('t')
        .description('Run tests')
        .action(() => {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            console.log(__dirname);
            const sourceFile = path.join(__dirname, 'hello.ts');
            const targetDir = path.join(process.cwd(), 'src');
            const targetFile = path.join(targetDir, 'hello.ts');

            async function copyFile() {
                try {
                    // Ensure the target directory exists, create it if not
                    await fs.mkdir(targetDir, { recursive: true });

                    // Copy the file
                    await fs.copyFile(sourceFile, targetFile);

                    console.log(`File copied successfully to ${targetFile}`);
                } catch (err) {
                    console.error('Error copying the file:', err);
                }
            }

            // Execute the function
            copyFile();
        });
}

program.parse(process.argv);
