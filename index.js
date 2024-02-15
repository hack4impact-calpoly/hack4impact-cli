#!/usr/bin/env node

const { program } = require('commander');

program
  .name("hack4impact-cli")
  .description("CLI to initialize and set up volunteer management systems");

program.command('init')
  .description('Initialize a new volunteer management project')
  .action(initProject);

program.command('add-db')
  .description('Add a database to the project')
  .action(addDatabase);

function initProject() {
  console.log('Initializing a new project...');
  // Clone boilerplate, setup project structure, etc.
}

function addDatabase() {
  console.log('Adding a database...');
  // Database setup logic here
}

program.parse(process.argv);
