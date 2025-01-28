import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { gitAddAndCommitAndPush } from '../bootstrapper/git';
import { runGhActionByName } from '../bootstrapper/meta';
import { editMetadataInPlace, query } from '../db';
import { GalacticMetadata, MetadataType, ProjectMetadata } from '../models';
import { runCmdAsync } from '../shellProxy';

export const refreshAzureCredentials = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const output = await runCmdAsync('az', ['account', 'show'], {
            join: true,
        });
        const data = JSON.parse((output || '').trim() || '{}');
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const getResourceGroups = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const output = await runCmdAsync(
            'az',
            ['group', 'list', '-o', 'json'],
            {
                join: true,
                fail: true,
            }
        );
        if (output?.includes('ERROR')) {
            throw new Error(output);
        }
        const parsed = JSON.parse((output || '').trim() || '[]');
        const mapped = parsed.map((g: any) => ({
            id: g.id,
            name: g.name,
            location: g.location,
        }));
        res.json(mapped);
    } catch (error) {
        if (
            (error as Error).message.includes(
                'The refresh token has expired due to inactivity'
            )
        ) {
            res.status(400).json({
                error: 'Azure credentials expired. Please login again using this command: `az login --scope https://management.core.windows.net//.default` in your terminal.',
            });
        } else if ((error as Error).message.includes('AADSTS50076')) {
            res.status(400).json({
                error: (error as Error).message,
                cmd: 'az login --use-device-code',
            });
        }
        next(error);
    }
};

export const getResourcesInGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const rgName = req.query.rgName as string;
        if (!rgName) {
            res.status(400).json({ error: 'rgName is required' });
            return;
        }
        const output = await runCmdAsync(
            'az',
            ['resource', 'list', '--resource-group', rgName, '-o', 'json'],
            {
                join: true,
            }
        );
        const parsed = JSON.parse((output || '').trim() || '[]');
        const mapped = parsed.map((r: any) => ({
            id: r.id,
            name: r.name,
            type: r.type,
            location: r.location,
        }));
        res.status(200).json(mapped);
    } catch (error) {
        next(error);
    }
};

export const terraformApply = async (
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

        const subIdOutput = await runCmdAsync(
            'az',
            ['account', 'show', '--query', 'id', '-o', 'tsv'],
            {
                join: true,
            }
        );
        const subId = subIdOutput?.trim();
        const prefix = project.projectName;

        const adminPassword =
            (req.query.admin_password as string) || 'Secret123';
        const applyOutput = await runCmdAsync(
            'terraform',
            [
                'apply',
                '-auto-approve',
                '-var',
                `subscription_id=${subId}`,
                '-var',
                `prefix=${prefix}`,
                '-var',
                `admin_password=${adminPassword}`,
            ],
            { join: true, cwd: path.join(project.workingDir!, 'terraform') }
        );

        await updateGithubActionsSecrets(projectId);

        // wait 1s using promise
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // add and push
        await gitAddAndCommitAndPush(projectId);

        // run init gh action
        await runGhActionByName(projectId, 'initial-setup.yml');

        // wait 4s using promise
        await new Promise((resolve) => setTimeout(resolve, 4000));

        const urlOutput = await runCmdAsync(
            'gh',
            ['run', 'list', '--json', 'url', '--jq', '.[0].url'],
            {
                join: true,
                cwd: project.workingDir,
                env: { ...process.env, GH_TOKEN: galaxy.githubPat },
            }
        );

        new Promise((resolve) => setTimeout(resolve, 120000)).then(async () => {
            await runGhActionByName(projectId, 'setup-backend.yml');
        });
        res.json({ output: applyOutput, ghActionLink: urlOutput });
    } catch (error) {
        next(error);
    }
};

export const terraformDestroy = async (
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

        const subIdOutput = await runCmdAsync(
            'az',
            ['account', 'show', '--query', 'id', '-o', 'tsv'],
            {
                join: true,
            }
        );
        const subId = subIdOutput?.trim();
        const prefix = project.projectName;
        const adminPassword =
            (req.query.admin_password as string) || 'Secret123';
        const destroyOutput = await runCmdAsync(
            'terraform',
            [
                'destroy',
                '-auto-approve',
                '-var',
                `subscription_id=${subId}`,
                '-var',
                `prefix=${prefix}`,
                '-var',
                `admin_password=${adminPassword}`,
            ],
            { join: true, cwd: path.join(project.workingDir!, 'terraform') }
        );
        res.json({ output: destroyOutput });
    } catch (error) {
        next(error);
    }
};

export const updateGithubActionsSecretsRoute = async (
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

        await updateGithubActionsSecrets(projectId);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

export const updateGithubActionsSecrets = async (projectId: number) => {
    // get the ip of the vm created and update the github actions secrets
    // also update the password
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

    // get the ip of the vm created

    const ip = await runCmdAsync(
        'az',
        [
            'vm',
            'list-ip-addresses',
            '--resource-group',
            `${project.projectName}-rg`,
            '--query',
            '[0].virtualMachine.network.publicIpAddresses[0].ipAddress',
            '-o',
            'tsv',
        ],
        {
            join: true,
            cwd: project.workingDir,
        }
    );

    const password = 'Secret123';
    if (!ip) {
        throw new Error('IP not found');
    }
    if (!password) {
        throw new Error('Password not found');
    }

    // set ip of the vm in the project metadata in place
    await editMetadataInPlace<ProjectMetadata>(
        MetadataType.Project,
        projectId,
        (x) => (x.azureVmIp = ip)
    );

    // update the github actions secrets using the gh cli

    await runCmdAsync('gh', ['secret', 'set', 'MACHINE_IP', '--body', ip], {
        join: true,
        env: { ...process.env, GH_TOKEN: galaxy.githubPat },
        cwd: project.workingDir,
    });

    // update secret
    await runCmdAsync(
        'gh',
        ['secret', 'set', 'MACHINE_SECRET', '--body', password],
        {
            join: true,
            cwd: project.workingDir,
            env: { ...process.env, GH_TOKEN: galaxy.githubPat },
        }
    );
};

export const deployToVmUsingGhActionsRoute = async (
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

        const actionUrl = await deployToVmUsingGhActions(projectId);
        res.json({ success: true, actionUrl });
    } catch (error) {
        next(error);
    }
};

export const deployToVmUsingGhActions = async (projectId: number) => {
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

    await gitAddAndCommitAndPush(projectId);

    const output = await runCmdAsync(
        'gh',
        ['workflow', 'run', 'deploy-frontend.yml'],
        {
            join: true,
            cwd: project.workingDir,
            env: { ...process.env, GH_TOKEN: galaxy.githubPat },
        }
    );

    // wait 5s with promise
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const urlOutput = await runCmdAsync(
        'gh',
        ['run', 'list', '--json', 'url', '--jq', '.[0].url'],
        {
            join: true,
            cwd: project.workingDir,
            env: { ...process.env, GH_TOKEN: galaxy.githubPat },
        }
    );

    const actionUrl = urlOutput!.trim();
    if (!actionUrl) {
        throw new Error('Failed to retrieve GitHub Actions link');
    }
    return actionUrl;
};