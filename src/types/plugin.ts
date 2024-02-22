export interface StringIndexable {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: (packageJsonAdditions: any) => void;
}

interface BasePlugin {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    install: (packageJsonAdditions: any) => void;
}

export type Plugin = BasePlugin & StringIndexable;

/**
 * Example:
 * {
 *    eslint: Plugin,
 *    prettier: Plugin,
 * }
 */
export type PluginRegistry = {
    [key: string]: Plugin;
};

export type PluginConfigFile = {
    name: string;
    plugins: {
        [pluginName: string]: boolean;
    };
};
