import { Plugin } from 'types/plugin';
import colors from 'picocolors';
import fs from 'fs';
import path from 'path';

export default function installPlugins(Plugins: Plugin, pluginConfig: { plugins: { [key: string]: boolean } }) {
    const { plugins } = pluginConfig;
    const cyan = colors.cyan;
    console.log('Installing additional plugins...');
    const packageJsonAdditions = {};

    for (const [pluginName, isEnabled] of Object.entries(plugins)) {
        if (isEnabled) {
            try {
                console.log(`- ${cyan(pluginName)}`);
                // TypeScript doesn't like dynamic imports
                /* eslint-disable @typescript-eslint/no-explicit-any */
                (Plugins[pluginName] as any).install(packageJsonAdditions);
            } catch (error) {
                console.error(`Failed to initialize plugin ${pluginName}:`, error);
            }
        }
    }

    // Add new JSON to package.json all at once
    applyPackageJsonAdditions(packageJsonAdditions);
}

function applyPackageJsonAdditions(updates: any) {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    let content = '';
    try {
        content = fs.readFileSync(packageJsonPath, 'utf8');
    } catch (e) {
        console.error('Failed to read package.json:', e);
        return;
    }
    const packageJson = JSON.parse(content);

    // Iterate over the updates object and merge each section into packageJson
    Object.keys(updates).forEach((key) => {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key]) && updates[key] !== null) {
            // Assume a nested object structure and merge accordingly
            packageJson[key] = { ...packageJson[key], ...updates[key] };
        } else {
            // For top-level fields or arrays, replace or set the value directly
            packageJson[key] = updates[key];
        }
    });

    // Write the updated package.json back
    try {
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    } catch (e) {
        console.error('Failed to write package.json:', e);
    }
    const { green, cyan } = colors;
    console.log(`\n${green('✔')} ${cyan('package.json has been updated.')}`);
}
