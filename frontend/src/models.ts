// src/types.ts

export interface Project {
    id?: string;
    backendPort?: string;
    projectName: string;
    routeIds?: string[];
    pageIds: string[];
    sitePath?: string;
    galaxyId?: string;
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
    templateType?: string;
}

export interface GalacticMetadata {
    id?: number;
    githubOrg?: string;
    githubPat?: string;
    workingDir?: string;
    projectIds?: number[];
    lastUpdated?: Date;
}

export interface Component {
    id?: string;
    componentName?: string;
    componentType?: string;
    projectId?: string;
    lastUpdated?: Date;
    componentIds?: number[];
}
