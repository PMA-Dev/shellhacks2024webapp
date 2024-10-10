import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { pushMetadata } from '../db';

import { ComponentMetadata, MetadataType } from '../models';

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
