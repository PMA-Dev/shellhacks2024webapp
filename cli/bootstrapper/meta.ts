import path from 'path';
import { query } from '../db';
import { copyTemplateFileToProject } from '../factories/factory';
import { MetadataType, ProjectMetadata } from '../models';
import { runCmdAsync } from '../shellProxy';
import { createGitRepoAsync } from './git';

export const setupMeta = async (projectId: number) => {
    await addAndCommit(projectId);
    // wait for 1 using promise
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await createGitRepoForProject(projectId);
    await createAndSetupTerraform(projectId);
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

    await runCmdAsync('mkdir', ['-p', terraformPath], { cwd: project.workingDir, join: true });

    await copyTemplateFileToProject(templateName!, projectId, toPath);

    await runCmdAsync('terraform', ['init'], { cwd: terraformPath, join: true });

    console.log('copying template file to project-------------------');
};
