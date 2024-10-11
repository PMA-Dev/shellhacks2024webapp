import { NextFunction, Request, Response } from 'express';
import { getDefaultGalacticId, getRandomInt, query } from '../db';
import { writeConfigForBackendInFrontend } from '../factories/backendFactory';
import { createStaticFrontendPagesFromTemplate } from '../factories/factory';
import { GalacticMetadata, MetadataType, ProjectMetadata } from '../models';
import { killOnPort, runCmd } from '../shellProxy';
import { startBackend, stopBackend } from './backend';

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
        const projectId = Number(req.query.projectId);
        const project = await query<ProjectMetadata>(
            MetadataType.Project,
            projectId
        );
        startFrontendVite(projectId);
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
        const projectId = Number(req.query.projectId);
        await stopFrontendVite(projectId);
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
        if (!req.query.projectId) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const projectId = Number(req.query.projectId);
        await runFrontendStart(projectId);
    } catch (e) {
        next(e);
    }
};

export const setupWholeFrontend = async (projectId: number) => {
    await writeConfigForBackendInFrontend(projectId);
    await createStaticFrontendPagesFromTemplate(projectId);
};

export const runFrontendStart = async (projectId: number): Promise<number> => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const galacticId = project?.galaxyId ?? (await getDefaultGalacticId());
    const projectName = project?.projectName;
    const workingDir = (
        await query<GalacticMetadata>(MetadataType.Galactic, galacticId)
    )?.workingDir;
    if (!workingDir)
        throw new Error('No galactic metadata found for id: ' + galacticId);
    if (!projectName)
        throw new Error('No project metadata found for id: ' + projectId);
    const port = getRandomInt(1024, 49151);
    runCmd(
        'sh',
        [
            '-c',
            `git clone https://github.com/varun-d/template_react_ts_tw ${projectName} || true && rm -r ${workingDir}/${projectName}/.git || true && cd ${workingDir}/${projectName} && git init || true && git config init.defaultBranch main || true && bunx shadcn add card input label sonner || true && bun add @types/react-router-dom react-router-dom || true && git add . || true && git commit -am "init commit" || true && bun install || true`,
        ],
        { cwd: workingDir }
    );
    return port;
};

export const startFrontendVite = async (projectId: number) => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const galacticId = project?.galaxyId ?? (await getDefaultGalacticId());

    const workingDir = project?.workingDir;
    if (!workingDir)
        throw new Error('No galactic metadata found for id: ' + galacticId);

    runCmd('bun', ['vite', '--port', `${project.port}`], {
        cwd: workingDir,
    });
};

export const stopFrontendVite = async (projectId: number) => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const port = project?.port;
    if (!port)
        throw new Error('No project metadata found for id: ' + projectId);
    killOnPort(port);
};
