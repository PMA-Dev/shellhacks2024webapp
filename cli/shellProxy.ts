import { exec } from 'child_process';

export const runCmd = async (
    rawCmd: string[],
    spawn: boolean = false,
    dry: boolean = false
) => {
    console.log('going to run:', rawCmd, ', at path: ', __dirname);
    if (dry) {
        console.log(`would have run cmd: ${JSON.stringify(rawCmd)}...`);
    }
    if (!spawn) {
    } else {
        exec(rawCmd.join(' && '), (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Standard error: ${stderr}`);
                return;
            }
            console.log(`Standard output: ${stdout}`);
        });
    }
};
