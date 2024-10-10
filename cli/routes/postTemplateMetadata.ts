import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import {
    pushMetadata
} from '../db';

import path from 'path';
import {
    MetadataType,
    TemplateMetadata
} from '../models';
// Generated from routes/metadata.ts
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
    console.log(`Created template with id: ${metadataId}`);
    return metadataId;
};

