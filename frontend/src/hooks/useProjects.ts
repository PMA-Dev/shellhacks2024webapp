import { useState, useEffect } from "react";
import { Project } from "@/models";
import api from "./api";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
      const fetchProjects = async () => {
          const response = await api.get('/projects');
          setProjects(response.data);
      };

      fetchProjects();
  }, []);


  const addProject = async (project: Project) => {
    const response = await api.post("/projects", project);
    setProjects([...projects, response.data]);
  };

  const updateProject = async (project: Project) => {
    const response = await api.put(`/projects/${project.id}`, project);
    setProjects(projects.map((p) => (p.id === project.id ? response.data : p)));
  };

  const deleteProject = async (projectId: string) => {
    await api.delete(`/projects/${projectId}`);
    setProjects(projects.filter((p) => p.id !== projectId));
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
  };
};
