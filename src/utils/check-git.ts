import { execSync } from 'child_process';
import inquirer from 'inquirer';
import colors from 'picocolors';

/**
 * Validates the current Git repository status to ensure that the project can be deployed.
 * - Checks if it's a Git repository
 * - Checks if it has a remote
 * - Checks if there are unpushed changes
 */
async function validateGitHubStatus() {
    const { red, yellow } = colors;
    if (!isGitRepository()) {
        console.error(red('Error: This directory is not a Git repository. Did you mean to run: hack4impact-cli init'));
        process.exit(1);
    }
    if (!hasRemote()) {
        console.error(red('Error: This Git repository does not have a remote.'));
        console.error(
            'Please create a new repository in your GitHub organization.\nFirst create a repository in your GitHub organization, then\ngit remote add origin https://github.com/YourOrganizationName/YourRepositoryName.git'
        );
        process.exit(1);
    }
    if (hasUnpushedChanges(true)) {
        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continue',
                message: "You have uncommitted changes that won't be reflected in the deployment. Continue?",
                default: false,
                prefix: yellow('⚠️'),
            },
        ]);
        if (!answers.continue) {
            process.exit(1);
        }
    }
}

function isGitRepository() {
    try {
        execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

function hasRemote() {
    try {
        const result = execSync('git remote', { encoding: 'utf8' });
        return result.trim().length > 0;
    } catch {
        return false;
    }
}

function hasUnpushedChanges(silent: boolean): boolean {
    try {
        execSync('git diff --quiet && git diff --staged --quiet', { stdio: 'ignore' });
        return false;
    } catch {
        !silent && console.warn("You have uncommitted changes that won't be reflected in the deployment.");
        return true;
    }
}

export { validateGitHubStatus, isGitRepository, hasRemote, hasUnpushedChanges };
