import express, { type Express } from 'express';
import { NextFunction, Request, Response } from 'express';
import { Config } from './config';
import {
    ComponentMetadata,
    GalacticMetadata,
    GenericMetadata,
    MetadataType,
    PageMetadata,
    ProjectMetadata,
    TemplateMetadata,
} from './models';
import { queryAll } from './db';

const initializeMiddlewares = (app: Express) => {
    app.use(express.json());
};

const getHome = async (
    req: Request,
    res: Response<{ ok: boolean }>,
    next: NextFunction
): Promise<void> => {
    res.json({ ok: true });
};

const getAllMetadata = async (
    req: Request,
    res: Response<GenericMetadata[] | null | { message: string }>,
    next: NextFunction
): Promise<void> => {
    const isPresent = req.path.includes;
    if (isPresent(MetadataType.Galactic)) {
        const metadata = await queryAll<GalacticMetadata>(
            MetadataType.Galactic
        );
        res.json(metadata);
        return;
    }
    if (isPresent(MetadataType.Project)) {
        const metadata = await queryAll<ProjectMetadata>(MetadataType.Project);
        res.json(metadata);
        return;
    }
    if (isPresent(MetadataType.Page)) {
        const metadata = await queryAll<PageMetadata>(MetadataType.Page);
        res.json(metadata);
        return;
    }
    if (isPresent(MetadataType.Template)) {
        const metadata = await queryAll<TemplateMetadata>(
            MetadataType.Template
        );
        res.json(metadata);
        return;
    }
    if (isPresent(MetadataType.Component)) {
        const metadata = await queryAll<ComponentMetadata>(
            MetadataType.Component
        );
        res.json(metadata);
        return;
    }
    res.status(404).send({
        message: 'Path not found!',
    });
};

const initializeRoutes = async (app: Express) => {
    app.get('/home', getHome);
    app.get('/metadata/', getAllMetadata);
};

export const listen = async () => {
    const app = express();
    initializeMiddlewares(app);
    const host = Config.ServerHost;
    const port = Config.ServerPort;
    await initializeRoutes(app);
    app.listen(port, host, () => {
        console.log(`Server running on port ${host}:${port}`);
    });
};
