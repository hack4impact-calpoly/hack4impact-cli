import { Plugin } from 'types/plugin';
import { NPM } from './shared';
import config from './config.json';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Set up husky pre-commit hooks
 * - uses lint-staged to run prettier and eslint on staged files
 */

const husky: Plugin = {
    install: (packageJsonAdditions) => {
        NPM.installDev('husky lint-staged');
        createHuskyPreCommitHook();
        updatePackageJson(packageJsonAdditions);
    },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function updatePackageJson(packageJsonAdditions: any) {
    packageJsonAdditions.scripts = packageJsonAdditions.scripts || {};
    // Add or modify the husky and lint-staged configurations
    packageJsonAdditions.scripts.prepare = 'husky install';

    packageJsonAdditions.husky = {
        hooks: {
            'pre-commit': 'lint-staged',
        },
    };

    const scripts = ['npm run lint'];

    // If prettier is used in the project, make pre-commit hook run prettier as well
    config.plugins.prettier && scripts.push('npm run prettier');
    packageJsonAdditions['lint-staged'] = {
        'src/**': scripts,
    };
}

function createHuskyPreCommitHook() {
    const huskyDirPath = path.join(process.cwd(), '.husky');
    const preCommitFilePath = path.join(huskyDirPath, 'pre-commit');

    // Ensure the .husky directory exists
    if (!fs.existsSync(huskyDirPath)) {
        fs.mkdirSync(huskyDirPath);
    }

    // Write the pre-commit hook script
    fs.writeFileSync(
        preCommitFilePath,
        `#!/bin/sh
  npx lint-staged
  `,
        { encoding: 'utf8' }
    );

    // Set the pre-commit hook as executable
    execSync(`chmod +x "${preCommitFilePath}"`);
}

export default husky;
