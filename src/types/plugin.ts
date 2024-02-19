interface BasePlugin {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    install: (packageJsonAdditions: any) => void;
}

// Use a type for plugins that may have dynamic methods
export type Plugin = BasePlugin & {
    [key: string]: (packageJsonAdditions: any) => void;
};
