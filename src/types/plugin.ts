interface StringIndexable {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: (packageJsonAdditions: any) => void;
}

interface BasePlugin {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    install: (packageJsonAdditions: any) => void;
}

export type Plugin = BasePlugin & StringIndexable;
