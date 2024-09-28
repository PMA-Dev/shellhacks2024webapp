import { Request, Response, NextFunction } from 'express';
import { runCmd } from '../shellProxy';
import { query } from '../db';
import { GalacticMetadata, MetadataType, ProjectMetadata } from '../models';

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
) => {
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

    runCmd([
        `cd ${workingDir}`,
        `git clone https://github.com/varun-d/template_react_ts_tw ${projectName}`,
        `rm -r ${workingDir}/${projectName}/.git`,
        `git init`,
        `git add .`,
        `git commit -am "init commit"`,
    ]);
};

export const bootGalaxy = async (galaxy: GalacticMetadata) => {
    const workingDir = galaxy.workingDir;
    runCmd([`mkdir -p ${workingDir}`]);
};
