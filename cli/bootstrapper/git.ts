import { NextFunction, Request, Response } from 'express';
import { query, tryGetGithubPat } from '../db';
import { GalacticMetadata, MetadataType, ProjectMetadata } from '../models';
import { runCmdAsync } from '../shellProxy';

export const attemptGetGhToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const pat = await tryGetGithubPat(Number(req.query.id));
        res.json(pat);
    } catch (error) {
        next(error);
    }
};

export const createGitRepo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }

        const project = await query<ProjectMetadata>(
            MetadataType.Project,
            Number(req.query.id)
        );
        if (!project) {
            res.status(404).json({ error: 'metadata not found' });
            return;
        }

        const pat = await createGitRepoAsync(project);
        res.json(pat);
    } catch (error) {
        next(error);
    }
};

export const getListOfOrgs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }

        const galaxy = await query<GalacticMetadata>(
            MetadataType.Galactic,
            Number(req.query.id)
        );
        if (!galaxy) {
            res.status(404).json({ error: 'metadata not found' });
            return;
        }
        const pat = await getListOfOrgsAsync(galaxy.githubPat);
        res.json(pat);
    } catch (error) {
        next(error);
    }
};

const createGitRepoAsync = async (project: ProjectMetadata) => {
    const galaxy = await query<GalacticMetadata>(
        MetadataType.Galactic,
        project.galaxyId!
    );
    await runCmdAsync(
        'gh',
        [
            'repo',
            'create',
            project.projectName,
            '--public',
            '--source=.',
            galaxy?.ghOrg ?? '',
        ],
        {
            cwd: project.workingDir,
            join: true,
            env: { GH_TOKEN: galaxy?.githubPat! },
        }
    );
};

const getListOfOrgsAsync = async (ghPat: string) => {
    const orgs = await runCmdAsync('gh', ['org', 'list'], {
        join: true,
        env: { GH_TOKEN: ghPat },
    });
    return orgs?.split('\n').filter((x) => x);
};
