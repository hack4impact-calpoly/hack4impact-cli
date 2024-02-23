#!/usr/bin/env node

import { program } from 'commander';
import initProject from './commands/init/init.js';
import addDatabase from './commands/database/database.js';
import deploy from './commands/deploy/deploy.js';
import { hack4ImpactRcExists } from 'utils/read-config-file.js';
import checkIfAnyDirectoryExists from 'utils/check-directory.js';
import colors from 'picocolors';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import path from 'path';
import { dirname } from 'path';

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

            // Specify the source directory and the target directory
            const baseSourceDir = path.join(__dirname, 'template');
            const baseTargetDir = path.join(process.cwd(), 'src');

            async function copyDirectory(source: string, target: string, isFirstCall = true) {
                if (isFirstCall) {
                    // Only prepend base directories in the first call
                    source = path.join(baseSourceDir, source);
                    target = path.join(baseTargetDir, target);
                }

                await fs.mkdir(target, { recursive: true });
                const entries = await fs.readdir(source, { withFileTypes: true });

                for (const entry of entries) {
                    const srcPath = path.join(source, entry.name);
                    const destPath = path.join(target, entry.name);

                    if (entry.isDirectory()) {
                        // For recursive calls, pass the paths directly without prepending base directories
                        await copyDirectory(srcPath, destPath, false);
                    } else {
                        await fs.copyFile(srcPath, destPath);
                    }
                }
            }
            copyDirectory('users', 'app/api')
                .then(() => console.log('Directory copied successfully.'))
                .catch((error) => console.error('Error copying directory:', error));
        });
}

program.parse(process.argv);
