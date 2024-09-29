import { promises as fs } from 'fs';
import { getDefaultGalacticId, query, queryAll } from './db';
import {
    GalacticMetadata,
    MetadataType,
    PageMetadata,
    ProjectMetadata,
    TemplateMetadata,
    TemplateTypes,
} from './models';
import { runCmd } from './shellProxy';
import path from 'path';
import { innerPostTemplateMetadata } from './routes/metadata';
import { getProjectData } from './routes/commands';

export const copyTemplateFileToProject = async (
    templateFileName: string,
    projectId: number,
    overridePath?: string
) => {
    const project = await getProjectData(projectId);
    const toPath = path.join(await getPagesPath(projectId), templateFileName);
    console.log('Checking if page already exists at:', toPath);
    if (toPath && (await doesPathExist(toPath))) return;
    console.log(`Page does not exist at ${toPath}, creating...`);

    await createPagesPath((await getDefaultGalacticId())!, projectId);

    const pathToCopy = path.join(overridePath ?? __dirname, 'templates', templateFileName);

    console.log(`Copying template from ${pathToCopy} to ${toPath}`);
    if (!pathToCopy)
        throw new Error('No template path found for page id: ' + templateFileName);

    console.log(`Copying template from ${pathToCopy} to ${toPath}`);
    runCmd('cp', [pathToCopy, toPath!]);
};

export const createPagesPath = async (
    galacticId: number,
    projectId: number
) => {
    const pagesPath = await getPagesPath(projectId);
    runCmd('mkdir', [pagesPath]);
};

export const createPageIdempotent = async (
    pageId: number,
    projectId: number
) => {
    const page = await query<PageMetadata>(MetadataType.Page, pageId);
    const pagesPath = page?.physicalPath;

    console.log('Checking if page already exists at:', pagesPath);
    if (pagesPath && (await doesPathExist(pagesPath))) return;
    console.log(`Page does not exist at ${pagesPath}, creating...`);

    await createPagesPath((await getDefaultGalacticId())!, projectId);

    const pathToCopy = await getTemplatePathToCopy(page?.templateId!);

    console.log(`Copying template from ${pathToCopy} to ${pagesPath}`);
    if (!pathToCopy)
        throw new Error('No template path found for page id: ' + pageId);

    console.log(`Copying template from ${pathToCopy} to ${pagesPath}`);
    runCmd('cp', [pathToCopy, pagesPath!]);
};

export const createHomePageIdempotent = async (projectId: number) => {
    const homePagePath = path.join(__dirname, 'templates', `Home.tsx`);

    const pagesPath = await getPagesPath(
        projectId
    );

    console.log(`Copying template from ${homePagePath} to ${pagesPath}`);
    if (!(await doesPathExist(pagesPath))) {
        await createPagesPath((await getDefaultGalacticId())!, projectId);
    }

    const pathToCopy = homePagePath;

    console.log(`Copying template from ${pathToCopy} to ${pagesPath}`);
    if (!pathToCopy)
        throw new Error('No template path found for page id: ' + projectId);

    console.log(`Copying template from ${pathToCopy} to ${pagesPath}`);
    runCmd('cp', [pathToCopy, pagesPath! + '/']);
};

export const getTemplatePathToCopy = async (templateId: number) => {
    const template = await query<TemplateMetadata>(
        MetadataType.Template,
        templateId
    );
    return template?.physicalPath;
};

export const doesPathExist = async (pathStr: string): Promise<boolean> => {
    try {
        await fs.access(pathStr);
        return true;
    } catch {
        return false;
    }
};

export const getWorkingDir = async () => {
    const galacticId = (await getDefaultGalacticId())!;
    const workingDir = (
        await query<GalacticMetadata>(MetadataType.Galactic, galacticId)
    )?.workingDir;
    if (!workingDir)
        throw new Error('No galactic metadata found for id: ' + galacticId);
    return workingDir;
};

export const getPagesPath = async (projectId: number) => {
    const workingDir = await getWorkingDir();
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const projectName = project?.projectName;
    if (!projectName)
        throw new Error('No project metadata found for id: ' + projectId);
    return path.join(workingDir, projectName, 'src/pages');
};

export const populateTemplates = async () => {
    const data = {
        templateName: 'Blog',
        templateType: TemplateTypes.Blog,
        componentIds: [],
    };

    const physicalPathOverride = path.join(
        __dirname,
        'templates',
        `${data.templateName}.tsx`
    );
    const metadataId = await innerPostTemplateMetadata(
        data,
        physicalPathOverride
    );
};
