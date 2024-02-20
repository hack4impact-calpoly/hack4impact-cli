import { execSync } from 'child_process';

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

export { isGitRepository, hasRemote, hasUnpushedChanges };
