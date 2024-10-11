import { NextFunction, Request, Response } from 'express';
import { getDefaultGalacticId, query, queryAll } from '../db';

import {
    ComponentMetadata,
    ControllerMetadata,
    GalacticMetadata,
    MetadataType,
    PageMetadata,
    ProjectMetadata,
    RouteMetadata,
    TemplateMetadata,
} from '../models';

// GET Handlers
export const getGalacticMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const metadata = await queryAll<GalacticMetadata>(
            MetadataType.Galactic
        );
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

export const getProjectMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const galacticId = req.query.galacticId
        ? Number(req.query.galacticId)
        : await getDefaultGalacticId();
    if (!galacticId) {
        res.status(400).json({
            error: `Galactic metadata not found query is: ${JSON.stringify(
                req.query
            )}`,
        });
        return;
    }
    try {
        const metadata = (
            await queryAll<ProjectMetadata>(MetadataType.Project)
        )?.filter((x) => x.galaxyId === galacticId);
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

export const getPageMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const metadata = await queryAll<PageMetadata>(MetadataType.Page);
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

export const getTemplateMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const metadata = await queryAll<TemplateMetadata>(
            MetadataType.Template
        );
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

export const getComponentMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const metadata = await queryAll<ComponentMetadata>(
            MetadataType.Component
        );
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

export const getRouteMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const metadata = await queryAll<RouteMetadata>(MetadataType.Route);
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

export const getControllerMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const metadata = await queryAll<ControllerMetadata>(
            MetadataType.Controller
        );
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

// GET by ID Handlers
export const getGalacticMetadataById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const metadata = await query<GalacticMetadata>(
            MetadataType.Galactic,
            Number(req.query.id)
        );
        if (!metadata) {
            res.status(404).json({ error: 'metadata not found' });
            return;
        }
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

export const getProjectMetadataById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const metadata = await query<ProjectMetadata>(
            MetadataType.Project,
            Number(req.query.id)
        );
        if (!metadata) {
            res.status(404).json({ error: 'metadata not found' });
            return;
        }
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

export const getPageMetadataById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const metadata = await query<PageMetadata>(
            MetadataType.Page,
            Number(req.query.id)
        );
        if (!metadata) {
            res.status(404).json({ error: 'metadata not found' });
            return;
        }
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

export const getTemplateMetadataById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const metadata = await query<TemplateMetadata>(
            MetadataType.Template,
            Number(req.query.id)
        );
        if (!metadata) {
            res.status(404).json({ error: 'metadata not found' });
            return;
        }
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

export const getComponentMetadataById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const metadata = await query<ComponentMetadata>(
            MetadataType.Component,
            Number(req.query.id)
        );
        if (!metadata) {
            res.status(404).json({ error: 'metadata not found' });
            return;
        }
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

export const getRouteMetadataById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const metadata = await query<RouteMetadata>(
            MetadataType.Route,
            Number(req.query.id)
        );
        if (!metadata) {
            res.status(404).json({ error: 'metadata not found' });
            return;
        }
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};

export const getControllerMetadataById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const metadata = await query<ControllerMetadata>(
            MetadataType.Controller,
            Number(req.query.id)
        );
        if (!metadata) {
            res.status(404).json({ error: 'metadata not found' });
            return;
        }
        res.json(metadata);
    } catch (error) {
        next(error);
    }
};
