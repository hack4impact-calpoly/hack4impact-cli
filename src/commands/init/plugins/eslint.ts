import { Plugin } from 'types/plugin';

/**
 * EsLint should already be installed in create-next-app,
 * we will be doing extra configurations
 */

const eslint: Plugin = {
    install: (packageJsonAdditions) => {
        packageJsonAdditions.scripts = packageJsonAdditions.scripts || {};
        packageJsonAdditions.scripts.lint = 'next lint src --fix';
    },
};
export default eslint;
