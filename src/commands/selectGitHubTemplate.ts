import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const templates = [
    { name: 'NextJS', url: 'https://github.com/hack4impact-calpoly/nextjs-app-template.git' },
    { name: 'None', url: 'None' },
];

const prompt = {
    type: 'list',
    name: 'template',
    message: 'Choose a template for your project:',
    choices: templates.map((t) => t.name),
};

const then = (answers: { template: string }, projectName: string, projectPath: string) => {
    const { url } = templates.find((t) => t.name === answers.template) || {};
    if (url) {
        if (url === 'None') {
            createDefaultTemplate(projectName, projectPath);
        } else {
            cloneTemplate(url, projectName);
        }
    } else {
        console.error('Invalid template selected.');
    }
};

function cloneTemplate(githubUrl: string, projectName: string): void {
    console.log(`Cloning template from ${githubUrl} into ${projectName}...`);

    exec(`git clone ${githubUrl} ${projectName}`, (error) => {
        if (error) {
            console.error(`Error cloning repository: ${error.message}`);
            return;
        }
        console.log(`Repository cloned into ${projectName}`);
    });
}

function createDefaultTemplate(projectName: string, projectPath: string) {
    fs.mkdirSync(projectPath, { recursive: true });
    fs.writeFileSync(
        path.join(projectPath, 'README.md'),
        `# ${projectName}\n\nProject initialized with hack4impact CLI.`
    );
    fs.writeFileSync(path.join(projectPath, 'config.json'), '{}');
}

export default { prompt, then };
