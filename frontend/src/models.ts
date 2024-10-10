// src/types.ts

export interface Project {
  id?: string;
  projectName: string;
  pageIds: string[];
  sitePath?: string;
}

export interface Page {
  id?: string;
  pageName: string;
  routerPath: string;
  templateId: string;
  templateType: string;
  projectId: string;
}

export interface Template {
  id?: string;
  componentIds: number[];
  templateName: string;
}

export interface GalacticMetadata {
  githubPat: string;
  workingDir: string;
  projectIds?: number[];
}
