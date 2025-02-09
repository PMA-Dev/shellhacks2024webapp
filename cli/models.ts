import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import HTTPMethod from 'http-method-enum';
import 'reflect-metadata';

// Base data record with validation for id
export class BaseDataRecord {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    lastUpdated?: Date;
}

// Galactic Metadata with validation decorators
export class GalacticMetadata extends BaseDataRecord {
    @IsString()
    @IsOptional()
    githubPat!: string;

    @IsString()
    @IsOptional()
    githubOrg?: string;

    @IsString()
    workingDir!: string;

    @IsArray()
    @IsNumber({}, { each: true })
    projectIds: number[] = [];

    @IsArray()
    githubOrgs: string[] = [];
}

// Project Metadata with validation decorators
export class ProjectMetadata extends BaseDataRecord {
    @IsString()
    projectName!: string;

    @IsString()
    @IsOptional()
    workingDir?: string;

    @IsString()
    @IsOptional()
    backendWorkingDir?: string;

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

    @IsOptional()
    @IsNumber()
    galaxyId?: number;

    @IsArray()
    @IsNumber({}, { each: true })
    routeIds: number[] = [];

    @IsOptional()
    @IsString()
    azureVmIp?: string;
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

export class RouteMetadata extends BaseDataRecord {
    @IsString()
    @IsOptional()
    fileName?: string;

    @IsNumber()
    @IsOptional()
    projectId?: number;

    @IsString()
    @IsOptional()
    physicalPath?: string;

    @IsString()
    @IsOptional()
    routeName?: string;

    @IsArray()
    @IsOptional()
    @IsNumber({}, { each: true })
    controllerIds: number[] = [];

    @IsArray()
    @IsOptional()
    middleWares?: MiddleWareBase[] = [];
}

export class ControllerMetadata extends BaseDataRecord {
    method?: HTTPMethod;

    @IsString()
    @IsOptional()
    pathName?: string;

    @IsString()
    @IsOptional()
    injectedCode?: string;

    @IsNumber()
    @IsOptional()
    dataSourceId?: number;

    @IsNumber()
    @IsOptional()
    routeId?: number;

    @IsString()
    @IsOptional()
    samplePayload?: string;

    @IsString()
    @IsOptional()
    sampleQueryParams?: string;

    @IsString()
    @IsOptional()
    basePath?: string;
}

export class MiddleWareBase {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    importString?: string;
}

export class DbMiddleWare extends MiddleWareBase {
    @IsString()
    importString = "import { pushLog, queryAll } from '../db';";
}

export class DataSourceMetadata extends BaseDataRecord {}

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
    Route = 'route',
    DataSource = 'dataSource',
    Controller = 'controller',
    Content = 'content',
}

export class ContentMetadata extends BaseDataRecord {
    @IsString()
    url!: string;

    @IsOptional()
    metadata?: Record<string, string> = {};
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

    @IsOptional()
    route?: MetadataTable<RouteMetadata>;

    @IsOptional()
    controller?: MetadataTable<ControllerMetadata>;

    @IsOptional()
    dataSource?: MetadataTable<DataSourceMetadata>;

    @IsOptional()
    content?: MetadataTable<ContentMetadata>;
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
    | ComponentMetadata
    | RouteMetadata
    | ControllerMetadata
    | DataSourceMetadata
    | ContentMetadata;


export type LogType = 'frontend' | 'backend' | 'worker';