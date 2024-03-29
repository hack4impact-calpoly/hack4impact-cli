#!/usr/bin/env node

import { program } from 'commander';
import initProject from './commands/init/init.js';
import addDatabase from './commands/database/database.js';
import deploy from './commands/deploy/deploy.js';
import auth from './commands/auth/auth.js';
import { hack4ImpactRcExists } from 'utils/read-config-file.js';
import checkIfAnyDirectoryExists from 'utils/check-directory.js';
import colors from 'picocolors';

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
    program.command('auth').description('Add authentication to the project').action(auth.execute);
}

program.parse(process.argv);
