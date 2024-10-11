// simple widget to render page data in the pages list
// just a simple wrapper around the page data

import { Page, Project } from '@/models';

interface PageOverviewWidgetProps {
    page: Page;
    project: Project;
}

const PageOverviewWidget = ({ page, project }: PageOverviewWidgetProps) => {
    return (
        <div className="flex flex-col space-y-2 border rounded-lg p-4 hover:bg-gray-100">
            <h3 className="text-lg font-semibold">{page.pageName}</h3>
            <p className="text-sm">
                {project?.sitePath}
                {page.routerPath}
            </p>
            <p>{page.templateType}</p>
        </div>
    );
};

export default PageOverviewWidget;
