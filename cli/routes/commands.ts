import { Request, Response, NextFunction } from 'express';
import { runCmd } from '../shellProxy';
import { getDefaultGalacticId, getRandomInt, query } from '../db';
import { GalacticMetadata, MetadataType, ProjectMetadata } from '../models';
import path from 'path';

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
        startFrontendVite(galacticId!, projectId);
        res.status(200).json({ message: 'Vite started' });
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
            `git clone https://github.com/varun-d/template_react_ts_tw ${projectName} && rm -r ${workingDir}/${projectName}/.git && cd ${workingDir}/${projectName} && git init && git config init.defaultBranch main && git add . && git commit -am "init commit" && bun install`,
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
