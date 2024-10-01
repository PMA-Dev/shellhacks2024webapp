import 'reflect-metadata';
import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

// Base data record with validation for id
export class BaseDataRecord {
    @IsOptional()
    @IsNumber()
    id?: number;
}

// Galactic Metadata with validation decorators
export class GalacticMetadata extends BaseDataRecord {
    @IsString()
    githubPat!: string;

    @IsString()
    workingDir!: string;

    @IsArray()
    @IsNumber({}, { each: true })
    projectIds: number[] = [];
}

// Project Metadata with validation decorators
export class ProjectMetadata extends BaseDataRecord {
    @IsString()
    projectName!: string;

    @IsArray()
    @IsNumber({}, { each: true })
    pageIds: number[] = [];

    @IsOptional()
    @IsString()
    sitePath?: string;

    @IsOptional()
    @IsNumber()
    port?: number;

    @IsOptional()
    @IsNumber()
    backendPort?: number;
}

// Page Metadata with validation decorators
export class PageMetadata extends BaseDataRecord {
    @IsString()
    pageName!: string;

    @IsString()
    routerPath!: string;

    @IsNumber()
    @IsOptional()
    templateId?: number;

    @IsOptional()
    @IsString()
    physicalPath?: string;
}

// Template Metadata with validation decorators
export class TemplateMetadata extends BaseDataRecord {
    @IsArray()
    @IsNumber({}, { each: true })
    componentIds: number[] = [];

    @IsString()
    templateName!: string;

    @IsString()
    @IsOptional()
    physicalPath?: string;

    @IsString()
    templateType!: TemplateTypes;
}

export enum TemplateTypes {
    Blog = 'Blog',
    DataEntry = 'DataEntry',
    Table = 'Table',
}

// Component Metadata with validation decorators
export class ComponentMetadata extends BaseDataRecord {
    @IsString()
    componentName!: string;

    @IsString()
    assetPath!: string;
}

// Metadata Table to hold arrays of metadata records
export class MetadataTable<T> {
    @IsArray()
    metadata: T[] = [];
}

// Enum for Metadata Types
export enum MetadataType {
    Galactic = 'galactic',
    Project = 'project',
    Page = 'page',
    Template = 'template',
    Component = 'component',
}

// MetadatasOuter with validation decorators
export class MetadatasOuter {
    @IsOptional() // This field may or may not be present
    galactic?: MetadataTable<GalacticMetadata>;

    @IsOptional()
    project?: MetadataTable<ProjectMetadata>;

    @IsOptional()
    page?: MetadataTable<PageMetadata>;

    @IsOptional()
    template?: MetadataTable<TemplateMetadata>;

    @IsOptional()
    component?: MetadataTable<ComponentMetadata>;
}

// DbData interface with MetadatasOuter
export class DbData {
    @IsOptional()
    metadatas?: MetadatasOuter;
}

export type GenericMetadata =
    | GalacticMetadata
    | ProjectMetadata
    | PageMetadata
    | TemplateMetadata
    | ComponentMetadata;
