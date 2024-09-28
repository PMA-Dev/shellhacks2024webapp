import { spawn } from 'child_process';

export const runCmd = (rawCmd: string[], dry: boolean = false) => {
    const fn = async () => {
        try {
            console.log('Going to run:', rawCmd, ', at path:', __dirname);
            if (dry) {
                console.log(`Would have run cmd: ${JSON.stringify(rawCmd)}...`);
                return;
            }
            const cmd = rawCmd.shift();
            if (!cmd) {
                console.error('No command specified.');
                return;
            }
            const child = spawn(cmd, rawCmd, {
                cwd: __dirname,
                shell: true,
                detached: true,
                stdio: 'ignore',
            });
            child.unref(); // Detach the child process
            console.log(`Spawned process with PID: ${child.pid}`);
        } catch (err) {
            console.error('Error in runCmd:', err);
        }
    };

    // Call fn without awaiting, and handle any potential errors
    fn().catch((err) => {
        console.error('Unhandled error in runCmd:', err);
    });
};
