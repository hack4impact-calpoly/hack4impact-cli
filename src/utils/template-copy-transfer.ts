import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import path from 'path';
import { dirname } from 'path';
import colors from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Specify the source directory and the target directory
const baseSourceDir = path.join(__dirname, 'template');
const baseTargetDir = path.join(process.cwd(), 'src');

const { cyan, green } = colors;
/**
 * Copies the template files to the user's target directory. Base is inside src/
 * @param source
 * @param target
 * @param isFirstCall
 */
export default async function templateCopyTransfer(source: string, target: string) {
    // If target starts with /, remove it
    if (target.startsWith('/')) {
        target = target.slice(1);
    }
    process.stdout.write(`- Adding items to ${cyan(`src/${target}`)}...`);
    // Append the source directory name to the target path
    target = path.join(baseTargetDir, target, path.basename(source));
    source = path.join(baseSourceDir, source);
    await copyDirectoryRecursive(source, target);

    process.stdout.write(green(' ✔ Done\n'));
}

async function copyDirectoryRecursive(source: string, target: string) {
    await fs.mkdir(target, { recursive: true });
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(source, entry.name);
        const destPath = path.join(target, entry.name);

        if (entry.isDirectory()) {
            await copyDirectoryRecursive(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}
