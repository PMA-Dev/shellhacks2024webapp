// src/context/ProjectContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

interface Page {
    id: string;
    name: string;
    template: string;
}

interface Project {
    id: string;
    name: string;
    pages: Page[];
}

interface ProjectContextType {
    projects: Project[];
    addProject: (project: Project) => void;
    addPageToProject: (projectId: string, page: Page) => void;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
    const [projects, setProjects] = useState<Project[]>([]);

    const addProject = (project: Project) => {
        setProjects([...projects, project]);
    };

    const addPageToProject = (projectId: string, page: Page) => {
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.id === projectId
                    ? { ...project, pages: [...project.pages, page] }
                    : project
            )
        );
    };

    return (
        <ProjectContext.Provider value={{ projects, addProject, addPageToProject }}>
            {children}
        </ProjectContext.Provider>
    );
};
