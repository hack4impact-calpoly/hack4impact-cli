import fs from 'fs';
import path from 'path';

export default function checkIfAnyDirectoryExists() {
    const cwd = process.cwd();
    const filesAndDirectories = fs.readdirSync(cwd);

    for (const name of filesAndDirectories) {
        const fullPath = path.join(cwd, name);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            return true; // Return true at the first directory found
        }
    }

    return false; // Return false if no directories are found
}
