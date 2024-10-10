import { Command } from 'commander';
import { runFrontendStart } from './bootstrapper/frontend';
import { listen } from './server';

const registerListenCmd = async (program: Command) => {
    const fn = async () => {
        await listen();
    };

    program.command('listen').description('Boots up the web server').action(fn);
};

const registerTestCmd = async (program: Command) => {
    const fn = async () => {
        const projId = 43639080;
        await runFrontendStart(projId);
    };

    program.command('test').description('Dev test').action(fn);
};

export const init = async () => {
    const program = new Command();
    program
        .name('galactic')
        .description('CLI to rule the galaxy')
        .version('0.0.1');
    await registerListenCmd(program);
    await registerTestCmd(program);
    await program.parseAsync();
};
