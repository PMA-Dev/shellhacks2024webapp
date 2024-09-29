// src/pages/ProjectPage.tsx

import { useParams, Routes, Route } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import PagesPage from './PagesPage';
import TemplatesPage from './TemplatesPage';
import ComponentsPage from './ComponentsPage';
import RouterPage from './RouterPage';
import AssetsPage from './AssetsPage';
import DBSchemaPage from './DBSchemaPage';
import GeneralProjectPage from './GeneralProjectPage';
import { useProjects } from '@/hooks/useProjects';
import { useEffect, useState } from 'react';
import ProjectContext from '../../context/ProjectContext.tsx';
import { Project } from '@/models';

function ProjectPage() {
    const { projectId } = useParams();
    const { getProjectById } = useProjects();
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        async function fetchProject() {
            const fetchedProject = await getProjectById(projectId!);
            if (!fetchedProject) {
                return;
            }
            setProject(fetchedProject);
            console.log('project:', fetchedProject);
        }
        fetchProject();
    }, [projectId]);

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="mb-4 text-3xl font-bold">{project.projectName}</h1>
                <ProjectContext.Provider value={project}>
                    {/* Nested Routes */}
                    <Routes>
                        <Route path="general" element={<GeneralProjectPage />} />
                        <Route path="pages" element={<PagesPage />} />
                        <Route path="templates" element={<TemplatesPage />} />
                        <Route path="components" element={<ComponentsPage />} />
                        <Route path="router" element={<RouterPage />} />
                        <Route path="assets" element={<AssetsPage />} />
                        <Route path="dbschema" element={<DBSchemaPage />} />
                    </Routes>
                </ProjectContext.Provider>
            </div>
        </div>
    );
}

export default ProjectPage;
