// src/pages/ProjectPage.tsx
import { useEffect, useState } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';

import { Sidebar } from '@/components/Sidebar';
import { useGalaxy } from '@/context/GalacticContext';
import { useProject } from '@/context/ProjectContext';
import { useGalacticMetadata } from '@/hooks/useGalacticMetadata';
import { useProjects } from '@/hooks/useProjects';
import AssetsPage from './AssetsPage';
import { AzurePage } from './AzurePage';
import ComponentsPage from './ComponentsPage';
import DBSchemaPage from './DBSchemaPage';
import { DeploymentsPage } from './Deployments';
import DevelopmentModePage from './DevelopmentPage';
import GeneralProjectPage from './GeneralProjectPage';
import { LogsPage } from './LogsPage';
import PagesPage from './PagesPage';
import RouterPage from './RouterPage';
import TemplatesPage from './TemplatesPage';
import { TestVideoRender } from './TestVideoRender';

function ProjectPage() {
    const { projectId } = useParams();
    const { setGalaxy } = useGalaxy();
    const { project, setProject } = useProject();
    const { getProjectById } = useProjects();
    const { getGalacticMetadataById } = useGalacticMetadata();
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    useEffect(() => {
        const fetchAndSetProject = async () => {
            if (!projectId) return;
            const data = await getProjectById(projectId);
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
    }, [project?.galaxyId]);

    if (!projectId) {
        return <div>No project with {projectId} found.</div>;
    }
    return (
        project && (
            <div className="flex h-screen">
                {isSidebarVisible && <Sidebar />}
                <div className="flex-1 p-8" id="project-router-wrapper">
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
                        <Route path="azure" element={<AzurePage />} />
                        <Route path="deployment" element={<DeploymentsPage />} />
                        <Route path="logs" element={<LogsPage />} />
                        <Route
                            path="development"
                            element={
                                <DevelopmentModePage
                                    onToggleSidebar={() =>
                                        setIsSidebarVisible((prev) => !prev)
                                    }
                                    isSidebarVisible={isSidebarVisible}
                                />
                            }
                        />
                    </Routes>
                </div>
            </div>
        )
    );
}

export default ProjectPage;
