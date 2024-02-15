#!/usr/bin/env node

import { program } from 'commander';
import { initProject } from './initProject.js';

program
  .name("hack4impact")
  .description("CLI to initialize and set up volunteer management systems");

program.command('init')
  .description('Initialize a new volunteer management project')
  .action(initProject);

program.command('add-db')
  .description('Add a database to the project')
  .action(addDatabase);

function addDatabase() {
  console.log('Adding a database...');
  // Database setup logic here
}

program.parse(process.argv);
