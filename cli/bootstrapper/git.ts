import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
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

export const createGitRepoAsync = async (project: ProjectMetadata) => {
    const galaxy = await query<GalacticMetadata>(
        MetadataType.Galactic,
        project.galaxyId!
    );

    if (!galaxy?.githubPat) throw new Error('Missing GitHub PAT');
    if (!project.projectName) throw new Error('Missing project name');

    const workingDir = project.workingDir;
    if (!fs.existsSync(String(workingDir)))
        throw new Error(`Working directory not found: ${workingDir}`);

    try {
        await runCmdAsync('git', ['-C', 'init'], {
            cwd: workingDir,
            join: true,
        });
    } catch (error) {
        console.error(`Failed to initialize git: ${error}`);
    }

    try {
        await runCmdAsync('git', ['commit', '-am', 'added first changes'], {
            cwd: workingDir,
            join: true,
        });
    } catch (error) {
        console.error(`Failed to git commit: ${error}`);
    }

    const repoName = galaxy.githubOrg
        ? `${galaxy.githubOrg}/${project.projectName}`
        : project.projectName;

    try {
        await runCmdAsync('gh', ['repo', 'create', repoName, '--private'], {
            cwd: workingDir,
            join: true,
            env: { GH_TOKEN: galaxy.githubPat },
        });
    } catch (error) {
        console.error(`Failed to create GitHub repo: ${error}`);
    }

    try {
        await runCmdAsync(
            'git',
            [
                'remote',
                'add',
                'origin',
                `https://github.com/${galaxy.githubOrg}/${project.projectName}.git`,
            ],
            {
                cwd: workingDir,
                join: true,
                env: { GH_TOKEN: galaxy.githubPat },
            }
        );
    } catch (error) {
        console.error(`Failed to create GitHub repo: ${error}`);
    }

    try {
        await runCmdAsync('git', ['push', '-u', 'origin', `master`], {
            cwd: workingDir,
            join: true,
            env: { GH_TOKEN: galaxy.githubPat, GIT_TOKEN: galaxy.githubPat },
        });
    } catch (error) {
        console.error(`Failed to create GitHub repo: ${error}`);
    }
};

const getListOfOrgsAsync = async (ghPat: string) => {
    const orgs = await runCmdAsync('gh', ['org', 'list'], {
        join: true,
        env: { GH_TOKEN: ghPat },
    });
    const orgList = orgs?.split('\n').filter((x) => x);
    const userName = await getUserName(ghPat);
    if (userName) orgList?.push(userName);
    return orgList;
};

const getUserName = async (ghPat: string) => {
    const data = await runCmdAsync('gh', ['api', 'user'], {
        join: true,
        env: { GH_TOKEN: ghPat },
    });

    const userData = JSON.parse(data?.trim() || '{}');
    return userData.login ?? '';
};
