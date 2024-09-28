import { Command } from 'commander';
import { runFrontendStart } from './shellProxy';
import { setupDb, write } from './db';

const registerInitCmd = async (program: Command) => {
    const fn = async () => {
        console.log('pre calling db...');
        await runSetupDb();
        console.log('post calling db...');

        console.log('pre launching frontend...');
        await launchApp();
        console.log('post launching frontend...');
    };

    program
        .command('init')
        .description('Inits the application and opens the local site')
        .action(fn);
};

const runSetupDb = async () => {
    await setupDb();
};

const launchApp = async () => {
    await runFrontendStart();
}

const registerTestCmd = async (program: Command) => {
    const fn = async () => {
        console.log('pre calling db...');
        await runSetupDb();
        console.log('post calling db...');


        const data = {id: 0, text: "test"};
        await write(data);

        // console.log('pre launching frontend...');
        // await launchApp();
        // console.log('post launching frontend...');
    };

    program
        .command('test')
        .description('local test')
        .action(fn);
};
 

export const init = async () => {
    const program = new Command();
    program
        .name('galactic')
        .description('CLI to rule the galaxy')
        .version('0.0.1');
    await registerInitCmd(program);
    await registerTestCmd(program);
    await program.parseAsync();
};
