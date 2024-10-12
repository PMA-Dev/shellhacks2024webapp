// src/pages/ProjectPage.tsx

import { Sidebar } from '@/components/Sidebar';
import { useProject } from '@/context/ProjectContext';
import { useProjects } from '@/hooks/useProjects';
import { useEffect } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import AssetsPage from './AssetsPage';
import ComponentsPage from './ComponentsPage';
import DBSchemaPage from './DBSchemaPage';
import GeneralProjectPage from './GeneralProjectPage';
import PagesPage from './PagesPage';
import RouterPage from './RouterPage';
import TemplatesPage from './TemplatesPage';

function ProjectPage() {
    const { projectId } = useParams();
    const { project, setProject } = useProject();
    const { getProjectById } = useProjects();

    useEffect(() => {
        const fetchAndSetProject = async () => {
            const data = await getProjectById(projectId!);
            setProject(data);
        };
        fetchAndSetProject();
    }, [getProjectById, projectId, setProject]);

    if (!projectId) {
        return <div>No project with {projectId} found.</div>;
    }
    return (
        project && (
                <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex-1 p-8">
                        <h1 className="mb-4 text-3xl font-bold">
                            {project!.projectName}
                        </h1>
                        {/* Nested Routes */}
                        <Routes>
                            <Route
                                path="general"
                                element={<GeneralProjectPage />}
                            />
                            <Route path="pages" element={<PagesPage />} />
                            <Route
                                path="templates"
                                element={<TemplatesPage />}
                            />
                            <Route
                                path="components"
                                element={<ComponentsPage />}
                            />
                            <Route path="router" element={<RouterPage />} />
                            <Route path="assets" element={<AssetsPage />} />
                            <Route path="dbschema" element={<DBSchemaPage />} />
                        </Routes>
                    </div>
                </div>
        )
    );
}

export default ProjectPage;
