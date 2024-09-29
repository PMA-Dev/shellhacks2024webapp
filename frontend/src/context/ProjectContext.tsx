// src/contexts/ProjectContext.tsx

import React, { createContext, useContext } from 'react';
import { Project } from '@/models';

const ProjectContext = createContext<Project | null>(null);

export const useProject = () => {
    return useContext(ProjectContext);
};

export default ProjectContext;
