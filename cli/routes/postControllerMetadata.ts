import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { editMetadataInPlace, pushMetadata, query } from '../db';

import { createRouteAndUpdateIndex } from '../factories/backendRouteFactory';
import { ControllerMetadata, MetadataType, RouteMetadata } from '../models';

export const postControllerMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.routeId) {
            res.status(400).json({ error: 'routeId is required' });
            return;
        }
        if (!req.query.projectId) {
            res.status(400).json({ error: 'projectId is required' });
            return;
        }

        const data = plainToInstance(ControllerMetadata, req.body);
        const errors = await validate(data);
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }

        const metadataId = await postControllerMetadataInner(
            Number(req.query.projectId),
            Number(req.query.routeId),
            data
        );
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};

export const postControllerMetadataInner = async (
    projectId: number,
    routeId: number,
    data: ControllerMetadata
): Promise<number> => {
    data.routeId = routeId;
    const metadataId = await pushMetadata(MetadataType.Controller, data);
    console.log(
        `before route: ${JSON.stringify(await query(MetadataType.Route, routeId))}`
    );
    await editMetadataInPlace<RouteMetadata>(
        MetadataType.Route,
        routeId,
        (x) =>
            x.controllerIds
                ? x.controllerIds.push(metadataId)
                : (x.controllerIds = [metadataId])
    );
    console.log(`finished editing route metadata for ${routeId}`);
    console.log(
        `after route: ${JSON.stringify(await query(MetadataType.Route, routeId))}`
    );

    console.log(`Creating page idempotent for ${metadataId}`);
    // re-generate file for route
    await createRouteAndUpdateIndex(projectId, routeId);

    return metadataId;
};
