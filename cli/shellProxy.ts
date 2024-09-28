export const runCmd = (
    command: string,
    args: string[],
    options?: { cwd?: string; dry?: boolean }
) => {
    const fn = async () => {
        try {
            const { cwd, dry } = options || {};
            console.log(
                'Going to run:',
                command,
                args,
                ', at path:',
                cwd || __dirname
            );
            if (dry) {
                console.log(
                    `Would have run cmd: ${command} ${args.join(' ')}...`
                );
                return;
            }

            const child = Bun.spawn({
                cmd: [command, ...args],
                cwd: cwd || __dirname,
                stdout: 'ignore', // Ignore standard output (do not log to current shell)
                stderr: 'ignore', // Ignore standard error (do not log to current shell)
                stdin: 'ignore', // Ignore standard input
                detached: true, // Run the child process independently from the parent process
            });

            // Ensure the child process runs independently of the parent process
            child.unref();

            console.log(`Spawned process with PID: ${child.pid}`);
        } catch (err) {
            console.error('Error in runCmd:', err);
        }
    };

    fn().catch((err) => {
        console.error('Unhandled error in runCmd:', err);
    });
};
