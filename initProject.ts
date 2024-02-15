import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

export async function initProject() {

  inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      validate: function(input) {
        if (input.length === 0) {
          return 'Project name cannot be empty.';
        }
        return true;
      }
    }
  ]).then(answers => {
    const projectName = answers.projectName;
    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
      console.error(`A directory named ${projectName} already exists.`);
      return;
    }

    fs.mkdirSync(projectPath, { recursive: true });
    fs.writeFileSync(path.join(projectPath, 'README.md'), `# ${projectName}\n\nProject initialized with hack4impact CLI.`);
    fs.writeFileSync(path.join(projectPath, 'config.json'), '{}');

    console.log(`Project ${projectName} initialized successfully.`);
  }).catch(error => {
    console.error('Failed to initialize project:', error);
  });
}