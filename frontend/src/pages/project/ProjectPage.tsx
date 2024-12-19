// src/pages/ProjectPage.tsx

import { Sidebar } from '@/components/Sidebar';
import { GithubLogo } from '@/components/ui/ghLogo';
import { useGalaxy } from '@/context/GalacticContext';
import { useProject } from '@/context/ProjectContext';
import { useGalacticMetadata } from '@/hooks/useGalacticMetadata';
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
import { TestVideoRender } from './TestVideoRender';

function ProjectPage() {
    const { projectId } = useParams();
    const { galaxy, setGalaxy } = useGalaxy();
    const { project, setProject } = useProject();
    const { getProjectById } = useProjects();
    const { getGalacticMetadataById } = useGalacticMetadata();

    useEffect(() => {
        const fetchAndSetProject = async () => {
            const data = await getProjectById(projectId!);
            setProject(data);
        };
        fetchAndSetProject();
    }, [getProjectById, projectId, setProject]);

    useEffect(() => {
        const fetchAndSetGalaxy = async () => {
            if (!project?.galaxyId) return;
            const data = await getGalacticMetadataById(
                Number(project.galaxyId)
            );
            setGalaxy(data);
        };
        fetchAndSetGalaxy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project?.galaxyId, setGalaxy]);

    if (!projectId) {
        return <div>No project with {projectId} found.</div>;
    }
    return (
        project && (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 p-8">
                    <div className="flex items-center mb-4">
                        <h1 className="text-3xl font-bold mr-2">
                            {project!.projectName}
                        </h1>
                        <a
                            href={`https://github.com/${galaxy?.githubOrg}/${project.projectName}`}
                            className="text-gray-600 hover:text-gray-900"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub Repository"
                        >
                            <GithubLogo />
                        </a>
                    </div>

                    {/* Nested Routes */}
                    <Routes>
                        <Route
                            path="general"
                            element={<GeneralProjectPage />}
                        />
                        <Route path="pages" element={<PagesPage />} />
                        <Route path="templates" element={<TemplatesPage />} />
                        <Route path="components" element={<ComponentsPage />} />
                        <Route path="router" element={<RouterPage />} />
                        <Route path="assets" element={<AssetsPage />} />
                        <Route path="dbschema" element={<DBSchemaPage />} />
                        <Route path="videotest" element={<TestVideoRender />} />
                    </Routes>
                </div>
            </div>
        )
    );
}

export default ProjectPage;
