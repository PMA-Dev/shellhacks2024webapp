import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { editMetadataInPlace, pushMetadata } from '../db';

import { createRouteAndUpdateIndex } from '../factories/backendRouteFactory';
import { MetadataType, ProjectMetadata, RouteMetadata } from '../models';

export const postRouteMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.projectId) {
            res.status(400).json({ error: 'projectId is required' });
            return;
        }
        const data = plainToInstance(RouteMetadata, req.body);
        const errors = await validate(data);
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        const metadataId = await postRouteMetadataInner(
            Number(req.query.projectId),
            data
        );
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};

export const postRouteMetadataInner = async (
    projectId: number,
    data: RouteMetadata
): Promise<number> => {
    const metadataId = await pushMetadata(MetadataType.Route, data);
    await editMetadataInPlace<ProjectMetadata>(
        MetadataType.Project,
        projectId,
        (x) => x.routeIds.push(metadataId)
    );

    console.log(`finished editing project metadata for ${projectId}`);

    console.log(`Creating route idempotent for ${metadataId}`);
    await createRouteAndUpdateIndex(projectId, metadataId);

    return metadataId;
};
