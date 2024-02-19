import { Plugin } from 'types/plugin';
// import { updatePackageJson, PackageJson } from './shared';

// import fs from 'fs';
// import path from 'path';

/**
 * EsLint should already be installed in create-next-app,
 * we will be doing extra configurations
 */

const eslint: Plugin = {
    install: (packageJsonAdditions) => {
        packageJsonAdditions.scripts = packageJsonAdditions.scripts || {};
        packageJsonAdditions.scripts.eslint = 'next lint --fix';
    },
};
export default eslint;

// function addToPackageJson() {
//     const packageJsonPath = path.join(process.cwd(), 'package.json');

//     // Read the existing package.json
//     fs.readFile(packageJsonPath, 'utf8', (err, data) => {
//         if (err) {
//             console.error('Failed to read package.json:', err);
//             return;
//         }

//         try {
//             const packageJson = JSON.parse(data);

//             // Add or modify the husky and lint-staged configurations
//             packageJson.scripts.lint = 'next lint --fix';
//             packageJson.scripts.eslint = 'next lint --fix';

//             // Write the modified package.json back to the file
//             fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', (writeErr) => {
//                 if (writeErr) {
//                     console.error('Failed to write package.json:', writeErr);
//                     return;
//                 }

//                 // VERBOSE && console.log('Successfully added Husky and lint-staged configuration to package.json.');
//             });
//         } catch (parseErr) {
//             console.error('Failed to parse package.json:', parseErr);
//         }
//     });
// }
