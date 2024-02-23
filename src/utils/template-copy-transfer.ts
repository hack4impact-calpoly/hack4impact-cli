import fs from 'fs-extra';

export async function templateCopyTransfer(sourceDir: string, destinationDir: string) {
    try {
        // Use fs-extra's copy method to copy the directory
        await fs.copy(sourceDir, destinationDir);
        console.log(`Directory copied from ${sourceDir} to ${destinationDir}`);
    } catch (error) {
        console.error('An error occurred while copying the directory:', error);
    }
}
