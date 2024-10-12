import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { getProjectData, getRandomInt, query } from '../db';
import {
    registerSetupAndCopyInitialRouteAndControllers,
    setupAllBackendFiles,
} from '../factories/backendFactory';
import { MetadataType, ProjectMetadata } from '../models';
import { killOnPort, runCmd, writeToFileForced } from '../shellProxy';

export const startBackendApp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.projectId) {
            res.status(400).json({ error: 'projectId is required' });
            return;
        }
        const projectId = Number(req.query.projectId);
        const project = await query<ProjectMetadata>(
            MetadataType.Project,
            projectId
        );
        startBackend(projectId);
        res.status(200).json({
            message:
                'Backend started at: ' + `localhost:${project?.backendPort}`,
        });
    } catch (e) {
        next(e);
    }
};

export const stopBackendApp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.projectId) {
            res.status(400).json({ error: 'projectId is required' });
            return;
        }
        const projectId = Number(req.query.projectId);
        await stopBackend(projectId);
        res.status(200).json({ message: 'Backend stopped' });
    } catch (e) {
        next(e);
    }
};

export const runBackendStart = async (projectId: number): Promise<number> => {
    const project = await getProjectData(projectId);
    const workingDir = project.workingDir;
    console.log(`Working dir: ${workingDir}`);

    const port = getRandomInt(1024, 49151);

    const indexTsContents = `
import 'dotenv/config';

import app from './app';

// Default port value
let port = ${port};

// Get the command-line arguments after the script name
const args = process.argv.slice(2);

// Loop through arguments to find '--port' parameter
args.forEach((arg) => {
if (arg.startsWith('--port=')) {
    const portValue = arg.split('=')[1];
    if (portValue) {
    port = parseInt(portValue, 10);
    }
}
});
app.listen(port, () => {
console.log('Listening: http://localhost:' + port);
});
    `;
    console.log(`Cloning backend template to ${workingDir}`);
    runCmd(
        'sh',
        [
            '-c',
            `git clone https://github.com/bassamanator/express-api-starter-template-ts backend || true && sudo rm -r ${workingDir}/backend/.git || true && cd ${workingDir}/backend && bun add @types/lowdb lowdb || true && bun add lowdb || true && git init && git config init.defaultBranch main && git add . && git commit -am "init commit" || true`,
        ],
        { cwd: workingDir! }
    );

    runCmd('sh', ['-c', `cd backend && bun install`], { cwd: workingDir! });

    const filePath = path.join(workingDir!, 'backend', 'src', 'index.ts');
    await writeToFileForced(filePath, indexTsContents);
    return port;
};

export const setupWholeBackend = async (projectId: number) => {
    await setupAllBackendFiles(projectId);
    await registerSetupAndCopyInitialRouteAndControllers(projectId);
};

export const startBackend = async (projectId: number) => {
    const project = await getProjectData(projectId);
    runCmd('bun', ['run', '--hot', `src/index.ts`], {
        cwd: project.backendWorkingDir,
    });
};

export const stopBackend = async (projectId: number) => {
    const project = await getProjectData(projectId);
    killOnPort(project.backendPort!);
};

export const bunFormatBackend = async (projectId: number) => {
    const project = await getProjectData(projectId);
    runCmd('bunx', ['prettier', '--write', `src/`, '**/*.{js,ts,tsx,json}'], {
        cwd: project.backendWorkingDir,
    });
};
