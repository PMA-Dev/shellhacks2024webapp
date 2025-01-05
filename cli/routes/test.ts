import { NextFunction, Request, Response } from 'express';
import { createAndSetupGithubActions } from '../bootstrapper/meta';

export const testRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const projectId = Number(req.query.projectId || '');
        await createAndSetupGithubActions(projectId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
};
