import type { Low } from 'lowdb';

export type DbType = Low<DbData>;

export interface DbData {
    metadatas: MetadatasOuter;
}

export interface MetadatasOuter {
    [MetadataType.Galactic]: MetadataTable<GalacticMetadata>;
    [MetadataType.Project]: MetadataTable<ProjectMetadata>;
    [MetadataType.Page]: MetadataTable<PageMetadata>;
    [MetadataType.Template]: MetadataTable<TemplateMetadata>;
    [MetadataType.Component]: MetadataTable<ComponentMetadata>;
}

export interface MetadataTable<T> {
    metadata: T[];
}

export interface BaseDataRecord {
    id: number;
}

export type GenericMetadata =
    | GalacticMetadata
    | ProjectMetadata
    | PageMetadata
    | TemplateMetadata
    | ComponentMetadata;
export interface GalacticMetadata extends BaseDataRecord {
    githubPat: string;
    workingDir: string;
    projectIds: number[];
}

export interface ProjectMetadata extends BaseDataRecord {
    projectName: string;
    pageIds: number[];
}

export interface PageMetadata extends BaseDataRecord {
    pageName: string;
    routerPath: string;
    templateIds: number[];
    physicalPath?: string;
}

export interface TemplateMetadata extends BaseDataRecord {
    componentIds: number[];
    templateName: string;
}

export interface ComponentMetadata extends BaseDataRecord {
    componentName: string;
    assetPath: string;
}

export enum MetadataType {
    Galactic = 'galactic',
    Project = 'project',
    Page = 'page',
    Template = 'template',
    Component = 'component',
}
