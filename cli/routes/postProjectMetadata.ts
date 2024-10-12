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
import { runBackendStart, setupWholeBackend } from '../bootstrapper/backend';
import { runFrontendStart, setupWholeFrontend } from '../bootstrapper/frontend';
import { createAppTsxFileForProject } from '../factories/createAppTsx';
import { GalacticMetadata, MetadataType, ProjectMetadata } from '../models';

export const postProjectMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
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
        const galaxy = await query<GalacticMetadata>(
            MetadataType.Galactic,
            galacticId
        );
        if (!galaxy) {
            res.status(400).json({
                error: 'Galactic metadata not found for id:' + galacticId,
            });
            return;
        }
        const data = plainToInstance(ProjectMetadata, req.body);
        const errors = await validate(data);
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        const metadataId = await pushMetadata(MetadataType.Project, data);

        await editMetadataInPlace<ProjectMetadata>(
            MetadataType.Project,
            metadataId,
            (x) => {
                x.galaxyId = galacticId;
                x.workingDir = path.join(galaxy!.workingDir, data.projectName);
                x.backendWorkingDir = path.join(
                    galaxy!.workingDir,
                    data.projectName,
                    'backend'
                );
            }
        );
        console.log(
            `edited in place and now is: ${JSON.stringify(await query(MetadataType.Project, metadataId))}`
        );
        console.log('~~~~~~~~~~~~~~~galaxy at mdt', galaxy);

        const port = await runFrontendStart(metadataId);
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
        await createAppTsxFileForProject(metadataId);
        res.json({ id: metadataId });
    } catch (error) {
        next(error);
    }
};
