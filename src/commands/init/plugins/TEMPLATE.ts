import { execSync } from 'child_process';
import { Plugin } from 'types/plugin';
import fs from 'fs';
import path from 'path';
import { updatePackageJson, PackageJson } from './shared';

const PACKAGE: Plugin = {
    install: () => {
        // Replace necessary parts of this function with your own plugin's installation steps
        execSync('npm install <<PACKAGE>>', { stdio: 'inherit' });
        createPrettierConfig(process.cwd());
        updatePackageJson((packageJson: PackageJson) => {
            packageJson.scripts = packageJson.scripts || {};
            packageJson.scripts.prettier = 'prettier --write .';
            return packageJson;
        });
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
