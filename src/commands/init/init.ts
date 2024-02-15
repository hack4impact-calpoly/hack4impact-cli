import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import selectGitHubTemplate from './selectGitHubTemplate';

/**
 * Initializes a new project by prompting the user for a project name and a GitHub template.
 */

export async function initProject() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Project name:',
                validate: (input) => {
                    // Basic validation: check if input is non-empty and a valid directory name
                    if (input.length === 0) {
                        return 'Project name cannot be empty.';
                    } else if (/^[\w-]+$/.test(input)) {
                        // Check if directory already exists
                        if (fs.existsSync(input)) {
                            return 'A directory with this name already exists.';
                        }
                        return true;
                    }
                    return 'Project name can only include letters, numbers, underscores, and hyphens.';
                },
            },
            selectGitHubTemplate.prompt,
        ])
        .then((answers) => {
            const projectName = answers.projectName;
            const projectPath = path.join(process.cwd(), projectName);

            selectGitHubTemplate.then(answers, projectName, projectPath);

            console.log(`Project ${projectName} initialized successfully.`);
        })
        .catch((error) => {
            console.error('Failed to initialize project:', error);
        });
}
