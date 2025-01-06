import path from 'path';
import { query } from '../db';
import { copyTemplateFileToProject } from '../factories/factory';
import { GalacticMetadata, MetadataType, ProjectMetadata } from '../models';
import { runCmdAsync } from '../shellProxy';
import { createGitRepoAsync, gitAddAndCommitAndPush } from './git';

export const setupMeta = async (projectId: number) => {
    await addAndCommit(projectId);
    // wait for 1 using promise
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await createGitRepoForProject(projectId);
    await createAndSetupTerraform(projectId);
    await createAndSetupGithubActions(projectId);
    await gitAddAndCommitAndPush(projectId);
};

export const createGitRepoForProject = async (projectId: number) => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    if (!project) {
        throw new Error('Project not found');
    }

    await createGitRepoAsync(project);
};

export const addAndCommit = async (projectId: number) => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    if (!project) {
        throw new Error('Project not found');
    }

    const cwd = project.workingDir;

    await runCmdAsync('rm', ['-rf', './backend/.git'], { cwd, join: true });
    await runCmdAsync('rm', ['-rf', './.git'], { cwd, join: true });
    await runCmdAsync(
        'git',
        ['config', '--global', 'init.defaultBranch', 'master'],
        { cwd, join: true }
    );
    await runCmdAsync('git', ['init'], { cwd, join: true });
    await runCmdAsync('git', ['add', '.'], { cwd, join: true });
    await runCmdAsync('git', ['commit', '-am', 'init commit'], {
        cwd,
        join: true,
    });
    await runCmdAsync('git', ['init'], { cwd, join: true });
};

export const createAndSetupTerraform = async (projectId: number) => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    if (!project) {
        throw new Error('Project not found');
    }

    const templateName = 'main.tf';
    const terraformPath = path.join(project.workingDir!, 'terraform');
    const toPath = path.join(terraformPath, templateName);

    console.log('copying template file to project-------------------');

    await runCmdAsync('bash', ['-c', 'echo -e "\\n.terraform" >> .gitignore'], {
        cwd: project.workingDir,
        join: true,
    });

    await runCmdAsync('mkdir', ['-p', terraformPath], {
        cwd: project.workingDir,
        join: true,
    });

    await copyTemplateFileToProject(templateName!, projectId, toPath);

    await runCmdAsync('terraform', ['init'], {
        cwd: terraformPath,
        join: true,
    });

    await runCmdAsync('echo', ['.terraform', '>>', '.gitignore'], {
        cwd: terraformPath,
        join: true,
    });

    console.log('copying template file to project-------------------');
};

export const createAndSetupGithubActions = async (projectId: number) => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    if (!project) {
        throw new Error('Project not found');
    }

    const templateName = 'deploy-frontend.yml';
    const ghActionsPath = path.join(
        project.workingDir!,
        '.github',
        'workflows'
    );
    const toPath = path.join(ghActionsPath, templateName);

    console.log('copying template file to project-------------------');

    await runCmdAsync('mkdir', ['-p', ghActionsPath], {
        cwd: project.workingDir,
        join: true,
    });

    await copyTemplateFileToProject(templateName!, projectId, toPath);

    const templateNameSetup = 'initial-setup.yml';
    const toPathSetup = path.join(ghActionsPath, templateNameSetup);
    await copyTemplateFileToProject(templateNameSetup!, projectId, toPathSetup);


    const templateNameSSL = 'setup-ssl.yml';
    const toPathSSL = path.join(ghActionsPath, templateNameSSL);
    await copyTemplateFileToProject(templateNameSSL!, projectId, toPathSSL);

    const templateNameBackendSetup = 'setup-backend.yml';
    const toPathBackendSetup = path.join(ghActionsPath, templateNameBackendSetup);
    await copyTemplateFileToProject(templateNameBackendSetup!, projectId, toPathBackendSetup);

    const templateNameBackendDeploy = 'deploy-backend.yml';
    const toPathBackendDeploy = path.join(ghActionsPath, templateNameBackendDeploy);
    await copyTemplateFileToProject(templateNameBackendDeploy!, projectId, toPathBackendDeploy);

    return;
};

export const runGhActionByName = async (
    projectId: number,
    actionName: string
) => {
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

    await runCmdAsync('gh', ['workflow', 'run', actionName], {
        cwd: project.workingDir,
        join: true,
        env: { ...process.env, GH_TOKEN: galaxy.githubPat },
    });
};
