import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import colors from 'picocolors';

function isGitRepository(directory: string) {
    return fs.existsSync(path.join(directory, '.git'));
}

export default function setupGitRepo(directory: string) {
    const { green, cyan } = colors;
    if (!isGitRepository(directory)) {
        execSync('git init', { cwd: directory, stdio: 'inherit' });
        console.log(`${green('✔')} ${cyan('Initialized a new Git repository.\n')}`);
    } else {
        console.log(`${green('✔')} ${cyan('Existing Git repository found.\n')}`);
    }
}

// TODO: Instruct the user to remember to link this current git repo to the org
// function instructGitHubRepoCreation(organizationName: string, projectName: string) {
//     console.log(`Please create a new repository in your GitHub organization.`);
//     console.log(`Visit https://github.com/organizations/${organizationName}/repositories/new`);
//     console.log(`Or, use the GitHub CLI:`);
//     console.log(`gh repo create ${organizationName}/${projectName} --public/private`);
// }

// git remote add origin https://github.com/YourOrganizationName/YourRepositoryName.git
