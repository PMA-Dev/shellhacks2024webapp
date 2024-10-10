import { promises as fs } from 'fs';

export const runCmd = (
    command: string,
    args: string[],
    options?: { cwd?: string; dry?: boolean; join?: boolean }
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

            if (!options?.join) {
                console.log('------Running in sync mode...');
                console.log(`Running command: ${command} ${args.join(' ')}`);
                const child = Bun.spawnSync({
                    cmd: [command, ...args],
                    cwd: cwd || __dirname,
                    detached: true,
                });
                if (child.stderr.toString().length > 0) {
                    console.error(
                        'Error in runCmd:',
                        JSON.stringify(child.stderr.toString()),
                        JSON.stringify(child.stdout.toString())
                    );
                }
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

export const writeToFileForced = async (filePath: string, contents: string) => {
    console.log(`going to rm ${filePath}`);
    // rm the file
    runCmd('rm', ['-f', filePath]);
    console.log(`Writing index.ts to ${filePath}`);
    await fs.writeFile(filePath, contents);
    console.log(`DONE!`);
};

export const killOnPort = (port: number) => {
    runCmd('sh', [
        '-c',
        `(lsof -t -i :${port} &>/dev/null && kill -9 $(lsof -t -i :${port}) || echo "No process running on port ${port}")`,
    ]);
};
