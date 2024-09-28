import { exec } from 'child_process';

export const runCmd = async (rawCmd: string) => {
    exec(rawCmd, (error, stdout, stderr) => {
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
};
