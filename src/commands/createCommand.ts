import { ICommand } from 'types/ICommand';
import { PluginRegistry, PluginConfigFile } from 'types/plugin';
import { readConfig } from 'utils/read-config-file';
import colors from 'picocolors';

export default function createCommand(config: {
    requiresProjectInitialized: boolean;
    plugins: PluginRegistry;
    pluginConfigFile: PluginConfigFile;
    action: (context: { plugins: PluginRegistry }) => Promise<void>;
}): ICommand {
    const { requiresProjectInitialized, plugins, pluginConfigFile, action } = config;

    return {
        requiresProjectInitialized,
        plugins,
        pluginConfigFile,
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
            if (pluginConfigFile) {
                const { cyan } = colors;
                // console.log('Loading plugins...');
                // const { plugins } = pluginConfigFile;
                for (const [pluginName, isEnabled] of Object.entries(plugins)) {
                    if (isEnabled) {
                        try {
                            console.log(`- ${cyan(pluginName)}`);
                            // TypeScript doesn't like dynamic imports
                            /* eslint-disable @typescript-eslint/no-explicit-any */
                            // (Plugins[pluginName] as any).install(packageJsonAdditions);
                        } catch (error) {
                            console.error(`Failed to initialize plugin ${pluginName}:`, error);
                        }
                    }
                }
            }
            // Custom logic for the command
            await action({ plugins });
        },
    };
}
