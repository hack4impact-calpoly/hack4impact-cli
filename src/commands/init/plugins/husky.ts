import { Plugin } from 'types/plugin';
import { NPM } from './shared';
import config from './config.json';

/**
 * Set up husky pre-commit hooks
 * - uses lint-staged to run prettier and eslint on staged files
 */

const husky: Plugin = {
    install: (packageJsonAdditions) => {
        NPM.installDev('husky lint-staged');
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
    },
};

export default husky;
