import { Plugin } from './plugin';

export interface ICommand {
    requiresProjectInitialized: boolean;
    plugins: Plugin[];
    execute(): Promise<void>;
}
