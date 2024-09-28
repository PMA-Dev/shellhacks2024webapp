// src/types.ts

export interface Project {
  id: string;
  name: string;
  pageIds: string[];
}

export interface Page {
  id?: string;
  name: string;
  route: string;
  templateIds: string[];
  projectId: string;
}
