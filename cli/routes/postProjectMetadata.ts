import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import {
    editMetadataInPlace,
    getDefaultGalacticId,
    pushMetadata,
    query,
} from '../db';

import path from 'path';
import { createAppTsxFileForProject } from '../create_app_tsx';
import { createHomePageIdempotent } from '../factory';
import { GalacticMetadata, MetadataType, ProjectMetadata } from '../models';
import {
    runBackendStart,
    runFrontendStart,
    setupWholeBackend,
    setupWholeFrontend,
} from './commands';

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
        const port = await runFrontendStart(metadataId);
        await createHomePageIdempotent(metadataId);
        const backendPort = await runBackendStart(metadataId);
        await editMetadataInPlace<GalacticMetadata>(
            MetadataType.Galactic,
            galacticId,
            (x) => x.projectIds.push(metadataId)
        );

        const galaxy = await query<GalacticMetadata>(
            MetadataType.Galactic,
            galacticId
        );
        await editMetadataInPlace<ProjectMetadata>(
            MetadataType.Project,
            metadataId,
            (x) => {
                x.sitePath = `http://localhost:${port}`;
                x.port = port;
                x.backendPort = backendPort!;
                x.workingDir = path.join(galaxy!.workingDir, data.projectName);
                x.backendWorkingDir = path.join(
                    galaxy!.workingDir,
                    data.projectName,
                    'backend'
                );
            }
        );

        await setupWholeFrontend(metadataId);
        await setupWholeBackend(metadataId);

        console.log(
            `Created page idempotent for ${metadataId} and now creating app.tsx for project with id ${metadataId}`
        );
        await createAppTsxFileForProject(metadataId);
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};
