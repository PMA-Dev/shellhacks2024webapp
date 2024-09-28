// src/pages/ProjectPage.tsx

import { useParams, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { ProjectContext } from '@/context/ProjectContext';
import { Sidebar } from '@/components/Sidebar';
import PagesPage from './PagesPage';
import TemplatesPage from './TemplatesPage';
import ComponentsPage from './ComponentsPage';
import RouterPage from './RouterPage';
import AssetsPage from './AssetsPage';
import DBSchemaPage from './DBSchemaPage';

function ProjectPage() {
    const { projectId } = useParams();
    const { projects } = useContext(ProjectContext)!;

    const project = projects.find((p) => p.id === projectId);

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="mb-4 text-3xl font-bold">{project.name}</h1>

                {/* Nested Routes */}
                <Routes>
                    <Route path="/" element={<div>Welcome to your project dashboard.</div>} />
                    <Route path="pages" element={<PagesPage projectId={projectId} />} />
                    <Route path="templates" element={<TemplatesPage />} />
                    <Route path="components" element={<ComponentsPage />} />
                    <Route path="router" element={<RouterPage />} />
                    <Route path="assets" element={<AssetsPage />} />
                    <Route path="dbschema" element={<DBSchemaPage />} />
                </Routes>
            </div>
        </div>
    );
}

export default ProjectPage;
