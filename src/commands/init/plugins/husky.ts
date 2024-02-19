import { Plugin } from 'types/plugin';
import fs from 'fs';
import path from 'path';
import { NPM } from './shared';
import config from './config.json';

const VERBOSE = false;

/**
 * Set up husky pre-commit hooks
 * - uses lint-staged to run prettier and eslint on staged files
 */

const husky: Plugin = {
    install: () => {
        NPM.installDev('husky lint-staged');
        addToPackageJson();
    },
};

function addToPackageJson() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    // Read the existing package.json
    fs.readFile(packageJsonPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read package.json:', err);
            return;
        }

        try {
            const packageJson = JSON.parse(data);

            // Add or modify the husky and lint-staged configurations
            packageJson.scripts.prepare = 'husky install';

            packageJson.husky = {
                hooks: {
                    'pre-commit': 'lint-staged',
                },
            };
            const scripts = ['npm run lint'];
            config.plugins.prettier && scripts.push('npm run prettier');
            packageJson['lint-staged'] = {
                'src/*': scripts,
            };

            // Write the modified package.json back to the file
            fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Failed to write package.json:', writeErr);
                    return;
                }

                VERBOSE && console.log('Successfully added Husky and lint-staged configuration to package.json.');
            });
        } catch (parseErr) {
            console.error('Failed to parse package.json:', parseErr);
        }
    });
}

export default husky;
