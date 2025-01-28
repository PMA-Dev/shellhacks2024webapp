import { NextFunction, Request, Response } from 'express';
import { runGhActionByName } from '../bootstrapper/meta';
import { query } from '../db';
import { GalacticMetadata, MetadataType, ProjectMetadata } from '../models';
import { runCmdAsync } from '../shellProxy';

export const deployByNameUsingGhAction = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const projectId = Number(req.query.projectId || '');
        if (!projectId) {
            res.status(400).json({ error: 'projectId is required' });
            return;
        }
        const project = await query<ProjectMetadata>(
            MetadataType.Project,
            projectId
        );
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        const service = req.query.service as string;
        if (!['frontend', 'backend', 'worker'].includes(service)) {
            res.status(400).json({ error: 'Invalid service name' });
            return;
        }

        const actionName = `deploy-${service}.yml`;
        await runGhActionByName(projectId, actionName);
        res.json({
            success: true,
            message: `Deployment started for ${service}`,
        });
    } catch (error) {
        next(error);
    }
};

export const getLatestStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const projectId = Number(req.query.projectId || '');
        if (!projectId) {
            res.status(400).json({ error: 'projectId is required' });
            return;
        }
        const project = await query<ProjectMetadata>(
            MetadataType.Project,
            projectId
        );
        if (!project) {
            throw new Error('Project not found');
        }

        const galaxy = await query<GalacticMetadata>(
            MetadataType.Galactic,
            project.galaxyId!
        );
        if (!galaxy) {
            throw new Error('Galaxy not found');
        }

        const services = ['frontend', 'backend', 'worker'];
        type Response = { url: string; status: string };
        const statuses: Record<string, Response> = {};

        for (const service of services) {
            const output = await runCmdAsync(
                'gh',
                [
                    'run',
                    'list',
                    '--workflow',
                    `deploy-${service}.yml`,
                    '--json',
                    'status',
                    '--json',
                    'url',
                    '--jq',
                    '.[0]',
                ],
                {
                    join: true,
                    cwd: project.workingDir,
                    env: { ...process.env, GH_TOKEN: galaxy.githubPat },
                }
            );

            const response: Response = JSON.parse(output || '{url: "", status: "unknown"}');
            statuses[service] = response;
        }

        res.json(statuses);
    } catch (error) {
        next(error);
    }
};
