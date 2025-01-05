import { Project } from '@/models';
import { createContext, useContext, useState } from 'react';
import api from '../hooks/api';

interface ProjectContextType {
    project: Project | null;
    setProject: (project: Project | null) => void;
    refetchProject: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};

export const ProjectProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [project, setProject] = useState<Project | null>(null);

    const refetchProject = async () => {
        if (!project?.id) return;
        try {
            const response = await api.get(
                `/metadata/get/project?id=${project.id}`
            );
            setProject(response.data);
        } catch (error) {
            console.error('Failed to refetch project:', error);
        }
    };

    return (
        <ProjectContext.Provider
            value={{ project, setProject, refetchProject }}
        >
            {children}
        </ProjectContext.Provider>
    );
};
