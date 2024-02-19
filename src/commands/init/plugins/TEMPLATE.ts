import { Plugin } from 'types/plugin';
import fs from 'fs';
import path from 'path';
import { NPM } from './shared';

const PACKAGE: Plugin = {
    install: (packageJsonAdditions) => {
        // Replace necessary parts of this function with your own plugin's installation steps
        NPM.installDev('npm install <<PACKAGE>>');
        createPrettierConfig(process.cwd());
        packageJsonAdditions.scripts = packageJsonAdditions.scripts || {};
        packageJsonAdditions.scripts.prettier = 'prettier --write .';
    },
};

function createPrettierConfig(projectPath: string) {
    const config = {
        printWidth: 120,
        singleQuote: true,
        useTabs: false,
        tabWidth: 4,
        semi: true,
        bracketSpacing: true,
        arrowParens: 'always',
        trailingComma: 'es5',
        bracketSameLine: false,
        jsxSingleQuote: true,
    };

    const configPath = path.join(projectPath, '.prettierrc');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
}

export default PACKAGE;
