import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { queryAll, pushMetadata, patchMetadata, query } from '../db';

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

export const getGalacticMetadataById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.id) {
        res.status(400).json({ error: 'id is required' });
        return;
    }
    const metadata = await query<GalacticMetadata>(MetadataType.Galactic, Number(req.query.id));
    if (!metadata) {
        res.status(404).json({ error: 'metadata not found' });
        return;
    }
    res.json(metadata);
};

export const getProjectMetadataById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.id) {
        res.status(400).json({ error: 'id is required' });
        return;
    }
    const metadata = await query<ProjectMetadata>(MetadataType.Project, Number(req.query.id));
    if (!metadata) {
        res.status(404).json({ error: 'metadata not found' });
        return;
    }
    res.json(metadata);
};

export const getPageMetadataById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.id) {
        res.status(400).json({ error: 'id is required' });
        return;
    }
    const metadata = await query<PageMetadata>(MetadataType.Page, Number(req.query.id));
    if (!metadata) {
        res.status(404).json({ error: 'metadata not found' });
        return;
    }
    res.json(metadata);
};

export const getTemplateMetadataById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.id) {
        res.status(400).json({ error: 'id is required' });
        return;
    }
    const metadata = await query<TemplateMetadata>(MetadataType.Template, Number(req.query.id));
    if (!metadata) {
        res.status(404).json({ error: 'metadata not found' });
        return;
    }
    res.json(metadata);
};

export const getComponentMetadataById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.id) {
        res.status(400).json({ error: 'id is required' });
        return;
    }
    const metadata = await query<ComponentMetadata>(MetadataType.Component, Number(req.query.id));
    if (!metadata) {
        res.status(404).json({ error: 'metadata not found' });
        return;
    }
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

export const patchGalacticMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.id) {
        res.status(400).json({ error: 'id is required' });
        return;
    }
    const metadataId = await patchMetadata(
        MetadataType.Galactic,
        req.body,
        Number(req.query.id)
    );
    res.json(metadataId);
};

export const patchProjectMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.id) {
        res.status(400).json({ error: 'id is required' });
        return;
    }
    const metadataId = await patchMetadata(
        MetadataType.Project,
        req.body,
        Number(req.query.id)
    );
    res.json(metadataId);
};

export const patchPageMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.id) {
        res.status(400).json({ error: 'id is required' });
        return;
    }
    const metadataId = await patchMetadata(
        MetadataType.Page,
        req.body,
        Number(req.query.id)
    );
    res.json(metadataId);
};

export const patchTemplateMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.id) {
        res.status(400).json({ error: 'id is required' });
        return;
    }
    const metadataId = await patchMetadata(
        MetadataType.Template,
        req.body,
        Number(req.query.id)
    );
    res.json(metadataId);
};

export const patchComponentMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.id) {
        res.status(400).json({ error: 'id is required' });
        return;
    }
    const metadataId = await patchMetadata(
        MetadataType.Component,
        req.body,
        Number(req.query.id)
    );
    res.json(metadataId);
};
