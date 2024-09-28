import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { queryAll, pushMetadata } from '../db';

import {
    GalacticMetadata,
    ProjectMetadata,
    PageMetadata,
    TemplateMetadata,
    ComponentMetadata,
    MetadataType,
} from '../models';

export const getGalacticMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data = req.body as GalacticMetadata;
    validate(data);
    const metadata = await queryAll<GalacticMetadata>(MetadataType.Galactic);
    res.json(metadata);
};

export const getProjectMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const metadata = await queryAll<ProjectMetadata>(MetadataType.Project);
    res.json(metadata);
};

export const getPageMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const metadata = await queryAll<PageMetadata>(MetadataType.Page);
    res.json(metadata);
};

export const getTemplateMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const metadata = await queryAll<TemplateMetadata>(MetadataType.Template);
    res.json(metadata);
};

export const getComponentMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const metadata = await queryAll<ComponentMetadata>(MetadataType.Component);
    res.json(metadata);
};

export const postGalacticMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const metadataId = await pushMetadata(MetadataType.Galactic, req.body);
    res.json(metadataId);
};

export const postProjectMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const metadataId = await pushMetadata(MetadataType.Project, req.body);
    res.json(metadataId);
};

export const postPageMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const metadataId = await pushMetadata(MetadataType.Page, req.body);
    res.json(metadataId);
};

export const postTemplateMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const metadataId = await pushMetadata(MetadataType.Template, req.body);
    res.json(metadataId);
};

export const postComponentMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const metadataId = await pushMetadata(MetadataType.Component, req.body);
    res.json(metadataId);
};
