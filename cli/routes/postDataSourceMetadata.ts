import { NextFunction, Request, Response } from 'express';

export const postDataSourceMetadataMetadata = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.projectId) {
            res.status(400).json({ error: 'projectId is required' });
            return;
        }
    } catch (error) {
        next(error);
    }
};
