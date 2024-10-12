import { promises as fs } from 'fs';
import path from 'path';
import { query, queryAll } from '../db';
import {
    MetadataType,
    PageMetadata,
    ProjectMetadata,
    TemplateMetadata,
} from '../models';

export const createAppTsxFileForProject = async (projectId: number) => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const workingDir = project?.workingDir!;
    const appTsxPath = path.join(workingDir, 'src/App.tsx');
    const pagePromises =
        project?.pageIds.map((pageId) =>
            query<PageMetadata>(MetadataType.Page, pageId)
        ) || [];
    const homePage = {
        pageName: 'Home',
        routerPath: '/',
        templateId: 0,
    };
    const pages = [...(await Promise.all(pagePromises)), homePage];
    const templates = await queryAll<TemplateMetadata>(MetadataType.Template);

    const pageImports = pages
        .map((page) => {
            if (
                page?.pageName == homePage.pageName ||
                page?.templateId == homePage.templateId
            ) {
                return `import { Home } from './pages/${page!.pageName}';`;
            }
            const template = templates!.find((t) => t.id === page?.templateId);
            return `import {${template!.templateType} as ${
                page!.pageName
            }} from './pages/${page!.pageName}';`;
        })
        .join('\n');

    const navLinks = pages
        .map(
            (page) =>
                `<Link to="${
                    page!.routerPath
                }" style={{ marginRight: '10px' }} className="text-grey-700 hover:text-grey-900 hover:scale-105 transition-all duration-200 z-10">${page!.pageName}</Link>`
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
            <nav class="absolute top-0 left-0 w-full backdrop-blur-sm p-4 bg-white bg-opacity-80 border-b border-gray-300">
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
