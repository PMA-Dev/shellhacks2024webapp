import { useState, useEffect } from "react";
import { Project } from "@/models";
import api from "./api";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    const response = await api.get("/metadata/all/project");
    setProjects(response.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (project: Project) => {
    await api.post("/metadata/post/project", project);
    await fetchProjects();
  };

  const updateProject = async (project: Project) => {
    const response = await api.patch(
      `/metadata/patch/project?id=${project.id}`,
      project
    );
    setProjects(projects.map((p) => (p.id === project.id ? response.data : p)));
  };

  const getProjectById = async (projectId: string) => {
    const response = await api.get(`/metadata/get/project?id=${projectId}`);
    return response.data;
  };

  return {
    projects,
    addProject,
    updateProject,
    getProjectById,
  };
};
