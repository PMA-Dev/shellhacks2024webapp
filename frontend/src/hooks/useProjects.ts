import { Project } from '@/models';
import { useCallback, useEffect, useState } from 'react';
import api from './api';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const fetchProjects = useCallback(async () => {
        const response = await api.get('/metadata/all/project');
        setProjects(response.data);
    }, []);

    const getProjectsForGalaxy = async (
        galaxyId: number
    ): Promise<Project[]> => {
        const response = await api.get(
            `/metadata/all/project?galacticId=${galaxyId}`
        );
        return response.data;
    };

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const addProject = async (
        project: Project,
        galaxyId?: number
    ): Promise<void> => {
        const url = galaxyId
            ? `/metadata/post/project?galacticId=${galaxyId}`
            : '/metadata/post/project';
        await api.post(url, project);
        await fetchProjects();
    };

    const updateProject = async (project: Project) => {
        const response = await api.patch(
            `/metadata/patch/project?id=${project.id}`,
            project
        );
        setProjects(
            projects.map((p) => (p.id === project.id ? response.data : p))
        );
    };

    const getProjectById = useCallback(async (projectId: string) => {
        const response = await api.get(`/metadata/get/project?id=${projectId}`);
        return response.data;
    }, []);

    return {
        projects,
        addProject,
        updateProject,
        getProjectById,
        getProjectsForGalaxy,
        fetchProjects
    };
};
