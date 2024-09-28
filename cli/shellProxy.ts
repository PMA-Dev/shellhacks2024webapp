import { exec } from 'child_process';
import { Config } from './config';

export const runCmd = async (rawCmd: string) => {
    console.log("going to run:", rawCmd, ", at path: ", __dirname);
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

export const runFrontendStart = async () => {
    const frontendPath = Config.FrontendRoot;
    const cmd = [`cd ${frontendPath}`, "bun run start", "cd -"].join(" && ");
    await runCmd(cmd);
}