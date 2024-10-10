import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { editMetadataInPlace, getDefaultGalacticId, pushMetadata } from '../db';

import path from 'path';
import { createAppTsxFileForProject } from '../create_app_tsx';
import { createPageIdempotent, getPagesPath } from '../factory';
import { MetadataType, PageMetadata, ProjectMetadata } from '../models';

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
        const pagesBasePath = await getPagesPath(Number(req.query.projectId));
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
