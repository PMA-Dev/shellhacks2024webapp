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
import { innerPostTemplateMetadata } from './routes/metadata';
import { getWorkingDir } from './factory';

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

