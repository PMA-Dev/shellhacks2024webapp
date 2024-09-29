import { promises as fs } from 'fs';
import { Request, Response, NextFunction } from 'express';
import { runCmd } from '../shellProxy';
import { getDefaultGalacticId, getRandomInt, query } from '../db';
import {
    GalacticMetadata,
    MetadataType,
    PageMetadata,
    ProjectMetadata,
    TemplateMetadata,
} from '../models';
import path from 'path';
import { createTablePageIdempotent, getWorkingDir } from '../factory';
import { run } from 'node:test';
import { writeConfigForBackendInFrontend, writeNewFileForBackendServer } from '../backend_factory';

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
        const galacticId = await getDefaultGalacticId();
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
        const galacticId = await getDefaultGalacticId();
        const projectId = Number(req.query.projectId);
        await stopBackend(projectId);
        res.status(200).json({ message: 'Backend stopped' });
    } catch (e) {
        next(e);
    }
};

export const startViteApp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.projectId) {
            res.status(400).json({ error: 'projectId is required' });
            return;
        }
        const galacticId = await getDefaultGalacticId();
        const projectId = Number(req.query.projectId);
        const project = await query<ProjectMetadata>(
            MetadataType.Project,
            projectId
        );
        startFrontendVite(galacticId!, projectId);
        // TODO tmp
        startBackend(projectId);
        res.status(200).json({
            message: 'Vite started at: ' + project?.sitePath,
        });
    } catch (e) {
        next(e);
    }
};

export const stopViteApp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.projectId) {
            res.status(400).json({ error: 'projectId is required' });
            return;
        }
        const galacticId = await getDefaultGalacticId();
        const projectId = Number(req.query.projectId);
        await stopFrontendVite(galacticId!, projectId);
        await stopBackend(projectId);
        res.status(200).json({ message: 'Vite stopped' });
    } catch (e) {
        next(e);
    }
};

export const runCreateReactApp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.galacticId || !req.query.projectId) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const galacticId = Number(req.query.galacticId);
        const projectId = Number(req.query.projectId);
        await runFrontendStart(galacticId, projectId);
    } catch (e) {
        next(e);
    }
};

export const runBackendStart = async (projectId: number): Promise<number> => {
    const workingDir = path.join(await getBackendWorkingDir(projectId), '..');
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
            `git clone https://github.com/bassamanator/express-api-starter-template-ts backend && sudo rm -r ${workingDir}/backend/.git && cd ${workingDir}/backend && git init && git config init.defaultBranch main &&  git add . && git commit -am "init commit"`,
        ],
        { cwd: workingDir! }
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    runCmd('sh', ['-c', `cd backend && bun install`], { cwd: workingDir! });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const filePath = path.join(workingDir!, 'backend', 'src', 'index.ts');
    await writeToFileForced(filePath, indexTsContents);
    return port;
};

export const setupWholeFrontend = async (projectId: number) => {
    await writeConfigForBackendInFrontend(projectId);
    await createTablePageIdempotent(projectId);
}


export const setupWholeBackend = async (projectId: number) => {
    await writeNewFileForBackendServer(projectId);
}

export const writeToFileForced = async (filePath: string, contents: string) => {
    console.log(`going to rm ${filePath}`);
    // rm the file
    runCmd('rm', ['-f', filePath]);
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(
        `Writing index.ts to ${filePath}`
    );
    await fs.writeFile(filePath, contents);
    console.log(`DONE!`);
}

export const getBackendWorkingDir = async (projectId: number) => {
    const project = await getProjectData(projectId);
    const workingDirBase = await getWorkingDir();
    const workingDir = path.join(
        workingDirBase,
        project.projectName,
        'backend'
    );
    return workingDir;
};

export const getProjectData = async (
    projectId: number
): Promise<ProjectMetadata> => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    if (!project)
        throw new Error('No project metadata found for id: ' + projectId);
    return project;
};

export const runFrontendStart = async (
    galacticId: number,
    projectId: number
): Promise<number> => {
    const workingDir = (
        await query<GalacticMetadata>(MetadataType.Galactic, galacticId)
    )?.workingDir;
    if (!workingDir)
        throw new Error('No galactic metadata found for id: ' + galacticId);
    const projectName = (
        await query<ProjectMetadata>(MetadataType.Project, projectId)
    )?.projectName;
    if (!projectName)
        throw new Error('No project metadata found for id: ' + projectId);
    const port = getRandomInt(1024, 49151);
    runCmd(
        'sh',
        [
            '-c',
            `git clone https://github.com/varun-d/template_react_ts_tw ${projectName} && rm -r ${workingDir}/${projectName}/.git && cd ${workingDir}/${projectName} && git init && git config init.defaultBranch main && bun add @types/react-router-dom react-router-dom && git add . && git commit -am "init commit" && bun install`,
        ],
        { cwd: workingDir }
    );
    return port;
};

export const bootGalaxy = async (galaxy: GalacticMetadata) => {
    runCmd('mkdir', ['-p', galaxy.workingDir]);
};

export const startFrontendVite = async (
    galacticId: number,
    projectId: number
) => {
    const workingDir = (
        await query<GalacticMetadata>(MetadataType.Galactic, galacticId)
    )?.workingDir;
    if (!workingDir)
        throw new Error('No galactic metadata found for id: ' + galacticId);
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const projectName = project?.projectName;
    if (!projectName)
        throw new Error('No project metadata found for id: ' + projectId);
    runCmd('bun', ['vite', '--port', `${project.port}`], {
        cwd: path.join(workingDir, projectName),
    });
};

export const startBackend = async (projectId: number) => {
    const project = await getProjectData(projectId);
    const workingDir = await getBackendWorkingDir(projectId);
    runCmd('bun', [`src/index.ts`], {
        cwd: workingDir,
    });
};

export const stopBackend = async (projectId: number) => {
    const project = await getProjectData(projectId);
    killOnPort(project.backendPort!);
};

export const stopFrontendVite = async (
    galacticId: number,
    projectId: number
) => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const port = project?.port;
    if (!port)
        throw new Error('No project metadata found for id: ' + projectId);
    killOnPort(port);
};

export const killOnPort = (port: number) => {
    runCmd('sh', [
        '-c',
        `(lsof -t -i :${port} &>/dev/null && kill -9 $(lsof -t -i :${port}) || echo "No process running on port ${port}")`,
    ]);
};
