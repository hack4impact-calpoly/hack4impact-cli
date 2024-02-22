import { PluginRegistry, PluginConfigFile } from './plugin';

export interface ICommand {
    requiresProjectInitialized: boolean;
    plugins: PluginRegistry;
    pluginConfigFile: PluginConfigFile;
    execute(): Promise<void>;
}
