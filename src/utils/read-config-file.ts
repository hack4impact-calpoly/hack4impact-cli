import fs from 'fs';
import path from 'path';

// Utility function to read the .hack4impactrc file
export default function readConfig(): { projectPath?: string } | undefined {
    const configPath = path.join(process.cwd(), '.hack4impactrc');
    if (fs.existsSync(configPath)) {
        const configFile = fs.readFileSync(configPath, 'utf-8');
        try {
            const config = JSON.parse(configFile);
            return config;
        } catch (error) {
            console.error('Failed to parse .hack4impactrc:', error);
            process.exit(1);
        }
    }
    console.error(
        '.hack4impactrc does not exist in the current directory. Run `hack4impact init` to create a new project.'
    );
    process.exit(1);
}
