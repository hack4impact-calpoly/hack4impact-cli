import { Plugin } from 'types/plugin';

export default async function installPlugins(Plugins: Plugin, pluginConfig: { plugins: { [key: string]: boolean } }) {
    const { plugins } = pluginConfig;

    for (const [pluginName, isEnabled] of Object.entries(plugins)) {
        if (isEnabled) {
            try {
                // TypeScript doesn't like dynamic imports
                /* eslint-disable @typescript-eslint/no-explicit-any */
                (Plugins[pluginName] as any).install();
            } catch (error) {
                console.error(`Failed to initialize plugin ${pluginName}:`, error);
            }
        }
    }
}
