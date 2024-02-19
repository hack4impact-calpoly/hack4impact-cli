#!/usr/bin/env node

import { program } from 'commander';
import { initProject } from './commands/init/init';
import { addDatabase } from './commands/add-db/add-db';

program.name('hack4impact-cli').description('CLI to initialize and set up volunteer management systems');

program.command('init').description('Initialize a new volunteer management project').action(initProject);

program.command('add-db').description('Add a database to the project').action(addDatabase);

program.parse(process.argv);
