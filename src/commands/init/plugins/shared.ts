import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function runCmd(cmd: string) {
    execSync(cmd, { stdio: 'inherit' });
}

export const NPM = {
    install: (pkg: string) => {
        runCmd(`npm install ${pkg}`);
    },
    installDev: (pkg: string) => {
        runCmd(`npm install ${pkg} -D`);
    },
};
/**
 * Updates package.json with custom modifications provided by the callback.
 *
 * @param {Function} modifyCallback - A callback function that takes the packageJson object
 *                                    and modifies it as needed.
 */
export const updatePackageJson = (modifyCallback: (json: PackageJson) => void) => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    fs.readFile(packageJsonPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read package.json:', err);
            return;
        }

        try {
            let packageJson = JSON.parse(data);

            // Call the callback function to modify the packageJson object
            packageJson = modifyCallback(packageJson);

            // Write the modified package.json back to the file
            fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Failed to write package.json:', writeErr);
                    return;
                }

                console.log('Successfully updated package.json.');
            });
        } catch (parseErr) {
            console.error('Failed to parse package.json:', parseErr);
        }
    });
};

export interface PackageJson {
    name?: string;
    version?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    husky?: {
      hooks: Record<string, string>;
    };
    'lint-staged'?: Record<string, string[] | string>;
    [key: string]: unknown;
  }