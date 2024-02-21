import { ICommand } from 'types/ICommand';
import { Plugin } from 'types/plugin';
import { readConfig } from 'utils/read-config-file';

export default function createCommand(config: {
    requiresProjectInitialized: boolean;
    plugins: Plugin[];
    config: string;
    action: (context: { plugins: Plugin[] }) => Promise<void>;
}): ICommand {
    const { requiresProjectInitialized, plugins, action } = config;

    return {
        requiresProjectInitialized,
        plugins,
        async execute() {
            // Always check requiresProjectInitialized flag
            if (requiresProjectInitialized) {
                const config = readConfig();

                if (!config || !config.projectPath) {
                    console.error('Project is not initialized.');
                    process.exit(1);
                }
            }
            // Always load in plugins if any
            if (plugins.length > 0) {
                // console.log('Loading plugins:', plugins);
                // Logic to load plugins
            }
            // Custom logic for the command
            await action({ plugins });
        },
    };
}
