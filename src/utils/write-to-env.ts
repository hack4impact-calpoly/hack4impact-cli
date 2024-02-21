import { existsSync, appendFile } from 'fs';
import colors from 'picocolors';

const envLocalPath = '.env.local';

/**
 * Writes to the .env.local file.
 */
export default function writeToEnv(key: string, value: string) {
    const { green, cyan } = colors;
    // Check if the .env.local file exists
    if (existsSync(envLocalPath)) {
        // Append a new line to the .env.local file
        appendFile(envLocalPath, `\n${key}=${value}\n`, (err) => {
            if (err) {
                console.error(`Failed to append ${key} to ${envLocalPath}:`, err);
            } else {
                console.log(`\n${green('✔')} Added new line for ${cyan(key)} to ${envLocalPath} file.`);
            }
        });
    } else {
        console.log(`${envLocalPath} file does not exist.`);
    }
}
