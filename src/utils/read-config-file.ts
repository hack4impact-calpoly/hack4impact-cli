import fs from 'fs';
import path from 'path';

// Check if the .hack4impactrc file exists in the current directory
export function hack4ImpactRcExists(): string | false {
    const filePath = path.join(process.cwd(), '.hack4impactrc');
    if (!fs.existsSync(filePath)) {
        return false;
    }
    return filePath;
}

// Utility function to read the .hack4impactrc file
export function readConfig(): { projectPath?: string } | undefined {
    const configPath = hack4ImpactRcExists();
    if (configPath) {
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
