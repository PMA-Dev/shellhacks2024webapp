import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
    queryAll,
    pushMetadata,
    patchMetadata,
    query,
    editMetadataInPlace,
    getDefaultGalacticId,
} from '../db';

import {
    GalacticMetadata,
    ProjectMetadata,
    PageMetadata,
    TemplateMetadata,
    ComponentMetadata,
    MetadataType,
} from '../models';
import { bootGalaxy, runBackendStart, runFrontendStart, setupWholeBackend, setupWholeFrontend } from './commands';
import path from 'path';
import {
    createHomePageIdempotent,
    createPageIdempotent,
    getPagesPath,
    populateTemplates,
} from '../factory';
import { createAppTsxFileForProject } from '../create_app_tsx';

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
    try {
        const metadata = await queryAll<ProjectMetadata>(MetadataType.Project);
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

// POST Handlers with Validation
export const postGalacticMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = plainToInstance(GalacticMetadata, req.body);
        const errors = await validate(data);
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        data.workingDir = path.join(data.workingDir, 'galactic');
        const metadataId = await pushMetadata(MetadataType.Galactic, data);
        await bootGalaxy(data);
        await populateTemplates();
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};

export const postProjectMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const galacticId = await getDefaultGalacticId();
        if (!galacticId) {
            res.status(400).json({ error: 'Galactic metadata not found' });
            return;
        }
        const data = plainToInstance(ProjectMetadata, req.body);
        const errors = await validate(data);
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        const metadataId = await pushMetadata(MetadataType.Project, data);
        const port = await runFrontendStart(galacticId, metadataId);
        // wait for 1s
        await new Promise((resolve) => setTimeout(resolve, 2500));
        await createHomePageIdempotent(metadataId);
        const backendPort = await runBackendStart(metadataId);
        await editMetadataInPlace<GalacticMetadata>(
            MetadataType.Galactic,
            galacticId,
            (x) => x.projectIds.push(metadataId)
        );

        await editMetadataInPlace<ProjectMetadata>(
            MetadataType.Project,
            metadataId,
            (x) => {
                x.sitePath = `http://localhost:${port}`;
                x.port = port;
                x.backendPort = backendPort!;
            }
        );

        await setupWholeFrontend(metadataId);
        await setupWholeBackend(metadataId);

        console.log(
            `Created page idempotent for ${metadataId} and now creating app.tsx for project with id ${metadataId}`
        );
        await createAppTsxFileForProject(
            (await getDefaultGalacticId())!,
            metadataId
        );
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};

export const postPageMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.projectId) {
            res.status(400).json({ error: 'projectId is required' });
            return;
        }
        const data = plainToInstance(PageMetadata, req.body);
        const errors = await validate(data);
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        const pagesBasePath = await getPagesPath(
            Number(req.query.projectId)
        );
        data.physicalPath = path.join(pagesBasePath, `${data.pageName}.tsx`);
        const metadataId = await pushMetadata(MetadataType.Page, data);
        await editMetadataInPlace<ProjectMetadata>(
            MetadataType.Project,
            Number(req.query.projectId),
            (x) => x.pageIds.push(metadataId)
        );
        console.log(
            `finished editing project metadata for ${req.query.projectId}`
        );

        console.log(`Creating page idempotent for ${metadataId}`);
        if (data.templateId) {
            console.log(`Creating page idempotent inside for ${metadataId}`);
            await createPageIdempotent(metadataId, Number(req.query.projectId));
            console.log(
                `Created page idempotent for ${metadataId} and now creating app.tsx for project with id ${req.query.projectId}`
            );
            await createAppTsxFileForProject(
                (await getDefaultGalacticId())!,
                Number(req.query.projectId)
            );
        }
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};

export const postTemplateMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = plainToInstance(TemplateMetadata, req.body);
        const metadataId = await innerPostTemplateMetadata(data);
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};

export const innerPostTemplateMetadata = async (
    data: TemplateMetadata,
    physicalPathOverride?: string
) => {
    const errors = await validate(data);
    if (errors.length > 0) {
        throw new Error('Validation failed');
    }

    data.physicalPath =
        physicalPathOverride ??
        path.join(__dirname, '..', 'templates', `${data.templateName}.tsx`);

    console.log(`Creating template at ${data.physicalPath}`);
    const metadataId = await pushMetadata(MetadataType.Template, data);
    return metadataId;
};

export const postComponentMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = plainToInstance(ComponentMetadata, req.body);
        const errors = await validate(data);
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        const metadataId = await pushMetadata(MetadataType.Component, data);
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};

// PATCH Handlers with Validation
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
