import { promises as fs } from 'fs';
import { getDefaultGalacticId, query, queryAll } from './db';
import {
    GalacticMetadata,
    MetadataType,
    PageMetadata,
    ProjectMetadata,
    TemplateMetadata,
} from './models';
import { runCmd } from './shellProxy';
import path from 'path';

export const createPagesPath = async (
    galacticId: number,
    projectId: number
) => {
    const pagesPath = await getPagesPath(galacticId, projectId);
    runCmd('mkdir', ['-p', pagesPath]);
};

export const createPageIdempotent = async (pageId: number, projectId: number) => {
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

export const getWorkingDir = async (galacticId: number) => {
    const workingDir = (
        await query<GalacticMetadata>(MetadataType.Galactic, galacticId)
    )?.workingDir;
    if (!workingDir)
        throw new Error('No galactic metadata found for id: ' + galacticId);
    return workingDir;
};

export const getPagesPath = async (galacticId: number, projectId: number) => {
    const workingDir = await getWorkingDir(galacticId);
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const projectName = project?.projectName;
    if (!projectName)
        throw new Error('No project metadata found for id: ' + projectId);
    return path.join(workingDir, projectName, 'src/pages');
};

export const createAppTsxFileForProject = async (
    galacticId: number,
    projectId: number
) => {
    const workingDir = await getWorkingDir(galacticId);
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const appTsxPath = path.join(
        workingDir,
        project?.projectName!,
        'src/App.tsx'
    );
    const pagePromises =
        project?.pageIds.map((pageId) =>
            query<PageMetadata>(MetadataType.Page, pageId)
        ) || [];
    const pages = await Promise.all(pagePromises);
    const templates = await queryAll<TemplateMetadata>(MetadataType.Template);

    const pageImports = pages
        .map(
            (page) =>{
                const template = templates!.find((t) => t.id === page?.templateId);
                return `import {${template!.templateType} as ${page!.pageName}} from './pages/${page!.pageName}';`;
            }
        )
        .join('\n');

    const navLinks = pages
        .map(
            (page) =>
                `<Link to="${
                    page!.routerPath
                }" style={{ marginRight: '10px' }}>${page!.pageName}</Link>`
        )
        .join('\n                ');

    const routes = pages
        .map(
            (page) =>
                `<Route path="${page!.routerPath}" element={<${
                    page!.pageName
                } />} />`
        )
        .join('\n                ');

    const appTsxContent = `
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

${pageImports}

const App = () => {
    return (
        <Router>
            <nav>
                ${navLinks}
            </nav>
            <Routes>
                ${routes}
            </Routes>
        </Router>
    );
};

export default App;
`;

    console.log(`Writing to ${appTsxPath}`);
    await fs.writeFile(appTsxPath, appTsxContent);
    console.log(`Wrote to ${appTsxPath}`);
};
