// src/contexts/ProjectContext.tsx

import { Project } from '@/models';
import { createContext, useContext } from 'react';

const ProjectContext = createContext<Project | null>(null);

export const useProject = () => {
    return useContext(ProjectContext);
};

export default ProjectContext;
