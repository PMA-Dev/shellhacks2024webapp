import { exec } from 'child_process';
import { Config } from './config';

const runCmd = async (rawCmd: string[], dry: boolean = true) => {
    console.log("going to run:", rawCmd, ", at path: ", __dirname);
    if (dry) {
        console.log(`would have run cmd: ${JSON.stringify(rawCmd)}...`);
    }
    exec(rawCmd.join(" && "), (error, stdout, stderr) => {
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
    const cmd = [`cd ${frontendPath}`, "bun run start", "cd -"];
    await runCmd(cmd);
}