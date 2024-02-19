interface BasePlugin {
    install: () => void;
}

// Use a type for plugins that may have dynamic methods
export type Plugin = BasePlugin & {
    [key: string]: () => void;
};
