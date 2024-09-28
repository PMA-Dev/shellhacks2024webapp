import { Command } from 'commander';

const registerInitCmd = async (program: Command) => {
    // .argument("<string>", "string to split")
    // .option("--first", "display just the first substring")
    // .option("-s, --separator <char>", "separator character", ",");

    const fn = async () => {
        console.log('pre calling db');
        await setupDb();
        console.log('post calling db');
    };

    program
        .command('init')
        .description('Inits the application and opens the local site')
        .action(fn);
};

const setupDb = async () => {
    await setupDb();
};

const launchApp = async () => {
}

export const init = async () => {
    const program = new Command();
    program
        .name('galactic')
        .description('CLI to rule the galaxy')
        .version('0.0.1');
    await registerInitCmd(program);
    await program.parseAsync();
};
