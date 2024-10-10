import { promises as fs } from 'fs';
import path from 'path';
import { query, queryAll } from './db';
import {
    MetadataType,
    PageMetadata,
    ProjectMetadata,
    TemplateMetadata,
    TemplateTypes,
} from './models';
import { innerPostTemplateMetadata } from './routes/postTemplateMetadata';
import { runCmd } from './shellProxy';

export const copyTemplateFileToProject = async (
    templateFileName: string,
    projectId: number,
    overrideToPath?: string
) => {
    const toPath =
        overrideToPath ??
        path.join(await getPagesPath(projectId), templateFileName);
    console.log('Checking if page already exists at:', toPath);
    if (toPath && (await doesPathExist(toPath))) return;
    console.log(`Page does not exist at ${toPath}, creating...`);

    await createPagesPath(projectId);

    const pathToCopy = path.join(__dirname, 'templates', templateFileName);

    console.log(`Copying template from ${pathToCopy} to ${toPath}`);
    if (!pathToCopy)
        throw new Error(
            'No template path found for page id: ' + templateFileName
        );

    console.log(`Copying template from ${pathToCopy} to ${toPath}`);
    runCmd('cp', [pathToCopy, toPath!]);
};

export const createPagesPath = async (projectId: number) => {
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

    await createPagesPath(projectId);

    const pathToCopy = await getTemplatePathToCopy(page?.templateId!);

    console.log(`Copying template from ${pathToCopy} to ${pagesPath}`);
    if (!pathToCopy)
        throw new Error('No template path found for page id: ' + pageId);

    console.log(`Copying template from ${pathToCopy} to ${pagesPath}`);
    runCmd('cp', [pathToCopy, pagesPath!]);
};

export const createTablePageIdempotent = async (projectId: number) => {
    const tablePagePath = path.join(__dirname, 'templates', `Table.tsx`);

    const pagesPath = await getPagesPath(projectId);

    console.log(`Copying template from ${tablePagePath} to ${pagesPath}`);
    if (!(await doesPathExist(pagesPath))) {
        await createPagesPath(projectId);
    }

    const pathToCopy = tablePagePath;

    console.log(`Copying template from ${pathToCopy} to ${pagesPath}`);
    if (!pathToCopy)
        throw new Error('No template path found for page id: ' + projectId);

    console.log(`Copying template from ${pathToCopy} to ${pagesPath}`);
    runCmd('cp', [pathToCopy, pagesPath! + '/']);
};

export const createGradientIdempotent = async (projectId: number) => {
    const tablePagePath = path.join(__dirname, 'templates', `Gradient.js`);

    const pagesPath = await getPagesPath(projectId);

    console.log(`Copying template from ${tablePagePath} to ${pagesPath}`);
    if (!(await doesPathExist(pagesPath))) {
        await createPagesPath(projectId);
    }

    const pathToCopy = tablePagePath;

    console.log(`Copying template from ${pathToCopy} to ${pagesPath}`);
    if (!pathToCopy)
        throw new Error('No template path found for page id: ' + projectId);

    console.log(`Copying template from ${pathToCopy} to ${pagesPath}`);
    runCmd('cp', [pathToCopy, pagesPath! + '/']);
};

export const createHomePageIdempotent = async (projectId: number) => {
    const homePagePath = path.join(__dirname, 'templates', `Home.tsx`);

    const pagesPath = await getPagesPath(projectId);

    console.log(`Copying template from ${homePagePath} to ${pagesPath}`);
    if (!(await doesPathExist(pagesPath))) {
        await createPagesPath(projectId);
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

export const getPagesPath = async (projectId: number) => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const workingDir = project?.workingDir!;
    if (!workingDir)
        throw new Error('No project metadata found for id: ' + projectId);
    return path.join(workingDir, 'src/pages');
};

export const populateTemplates  = async () => {
    const datas = [
        {
            templateName: 'Table',
            templateType: TemplateTypes.Table,
            componentIds: [],
        },

        {
            templateName: 'DataEntry',
            templateType: TemplateTypes.DataEntry,
            componentIds: [],
        },

        {
            templateName: 'Blog',
            templateType: TemplateTypes.Blog,
            componentIds: [],
        },
    ];

    const existingData = await queryAll<TemplateMetadata>(MetadataType.Template);
    if (existingData && existingData.length == datas.length) {
        return;
    }

    console.log(
        '\t-------------------Populating template:',
        JSON.stringify(datas)
    );

    for (const data of datas) {
        console.log('Populating template:', data);
        const metadataId = await innerPostTemplateMetadata(data);
    }

    const allTemplates = await queryAll<TemplateMetadata>(
        MetadataType.Template
    );
    console.log('All templates:', allTemplates);
};
