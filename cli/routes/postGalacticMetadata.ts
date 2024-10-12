import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { pushMetadata } from '../db';

import path from 'path';
import { bootGalaxy } from '../bootstrapper/appStart';
import { populateTemplates } from '../factories/factory';
import { GalacticMetadata, MetadataType } from '../models';

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
