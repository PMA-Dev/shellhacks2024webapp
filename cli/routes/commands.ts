import { Request, Response, NextFunction } from 'express';
import { runCmd } from '../shellProxy';
import { getDefaultGalacticId, getRandomInt, query } from '../db';
import { GalacticMetadata, MetadataType, ProjectMetadata } from '../models';

export const startViteApp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.projectId) {
            res.status(400).json({
                error: 'projectid is required',
            });
            return;
        }
        const galacticId = await getDefaultGalacticId();
        const projectId = Number(req.query.projectId);
        await startFrontendVite(galacticId!, projectId);
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
            res.status(400).json({
                error: 'galactic id and/or projectid is required',
            });
            return;
        }
        const galacticId = await getDefaultGalacticId();
        const projectId = Number(req.query.projectId);
        console.log(
            'Stopping vite for project:',
            projectId,
            'galactic:',
            galacticId
        );
        await stopFrontendVite(galacticId!, projectId);
    } catch (e) {
        console.log(
            'Error stopping vite:',
            JSON.stringify((e as Error).message)
        );
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

export const runFrontendStart = async (
    galacticId: number,
    projectId: number
): Promise<number> => {
    const workingDir = (
        await query<GalacticMetadata>(MetadataType.Galactic, galacticId)
    )?.workingDir;

    if (!workingDir) {
        throw new Error('No galactic metadata found for id: ' + galacticId);
    }

    const projectName = (
        await query<ProjectMetadata>(MetadataType.Project, projectId)
    )?.projectName;

    if (!projectName) {
        throw new Error('No project metadata found for id: ' + projectName);
    }
    const port = getRandomInt(1024, 49151);

    runCmd([
        `cd ${workingDir}`,
        `git clone https://github.com/varun-d/template_react_ts_tw ${projectName}`,
        `rm -r ${workingDir}/${projectName}/.git`,
        `git init`,
        `git config init.defaultBranch main`,
        `git add .`,
        `git commit -am "init commit"`,
        `cd ${workingDir}/${projectName}`,
        `bun install`,
    ]);
    return port;
};

export const bootGalaxy = async (galaxy: GalacticMetadata) => {
    const workingDir = galaxy.workingDir;
    runCmd([`mkdir -p ${workingDir}`]);
};

export const startFrontendVite = async (
    galacticId: number,
    projectId: number
) => {
    const workingDir = (
        await query<GalacticMetadata>(MetadataType.Galactic, galacticId)
    )?.workingDir;

    if (!workingDir) {
        throw new Error('No galactic metadata found for id: ' + galacticId);
    }

    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const projectName = project?.projectName;

    if (!projectName) {
        throw new Error('No project metadata found for id: ' + projectName);
    }
    runCmd([
        `cd ${workingDir}/${projectName}`,
        `bun vite --port ${project.port} &`,
    ]);
};

export const stopFrontendVite = async (
    galacticId: number,
    projectId: number
) => {
    const workingDir = (
        await query<GalacticMetadata>(MetadataType.Galactic, galacticId)
    )?.workingDir;

    if (!workingDir) {
        throw Error('No galactic metadata found for id: ' + galacticId);
    }

    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const projectName = project?.projectName;

    if (!projectName) {
        throw new Error('No project metadata found for id: ' + projectName);
    }
    killOnPort(Number(project.port));
};

export const killOnPort = (port: number) => {
    runCmd([
        `(lsof -t -i :${port} &>/dev/null && kill -9 $(lsof -t -i :${port}) || echo "No process running on port ${port}")&`,
    ]);
};
