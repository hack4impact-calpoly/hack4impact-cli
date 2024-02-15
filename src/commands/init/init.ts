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
                    if (input.length === 0) {
                        return 'Project name cannot be empty.';
                    } else if (/^[\w-]+$/.test(input)) {
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
        .then(async (answers) => {
            try {
                const projectName = answers.projectName;
                const projectPath = path.join(process.cwd(), projectName);
                const configPath = path.join(projectPath, '.hack4impactrc');
                const defaultConfig = { projectName, projectPath };

                if (!fs.existsSync(projectPath)) {
                    fs.mkdirSync(projectPath, { recursive: true });
                }

                await selectGitHubTemplate.action(answers, projectName, projectPath);

                fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
                console.log(`Config file .hack4impactrc created in ${configPath}\n`);
                console.log(`Project ${projectName} initialized successfully.`);
            } catch (error) {
                console.error('Failed to initialize project:', error);
            }
        })
        .catch((error) => {
            console.error('Failed to prompt:', error);
        });
}
