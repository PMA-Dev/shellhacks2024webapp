import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { patchMetadata } from '../db';

import {
    ComponentMetadata,
    GalacticMetadata,
    MetadataType,
    PageMetadata,
    ProjectMetadata,
    TemplateMetadata,
} from '../models';

export const patchGalacticMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const data = plainToInstance(GalacticMetadata, req.body);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        const metadataId = await patchMetadata(
            MetadataType.Galactic,
            data,
            Number(req.query.id)
        );
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};

export const patchProjectMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const data = plainToInstance(ProjectMetadata, req.body);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        const metadataId = await patchMetadata(
            MetadataType.Project,
            data,
            Number(req.query.id)
        );
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};

export const patchPageMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const data = plainToInstance(PageMetadata, req.body);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        const metadataId = await patchMetadata(
            MetadataType.Page,
            data,
            Number(req.query.id)
        );
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};

export const patchTemplateMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const data = plainToInstance(TemplateMetadata, req.body);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        const metadataId = await patchMetadata(
            MetadataType.Template,
            data,
            Number(req.query.id)
        );
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};

export const patchComponentMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const data = plainToInstance(ComponentMetadata, req.body);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        const metadataId = await patchMetadata(
            MetadataType.Component,
            data,
            Number(req.query.id)
        );
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};
