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
import { pushMetadata, queryAll } from './db';
import { validate } from 'class-validator';

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
    validate(req.body);
    console.log(
        `Going to get all metadata with path: ${JSON.stringify(req.path)}...`
    );
    if (req.path.includes(MetadataType.Galactic)) {
        const metadata = await queryAll<GalacticMetadata>(
            MetadataType.Galactic
        );
        res.json(metadata);
        return;
    }
    if (req.path.includes(MetadataType.Project)) {
        const metadata = await queryAll<ProjectMetadata>(MetadataType.Project);
        res.json(metadata);
        return;
    }
    if (req.path.includes(MetadataType.Page)) {
        const metadata = await queryAll<PageMetadata>(MetadataType.Page);
        res.json(metadata);
        return;
    }
    if (req.path.includes(MetadataType.Template)) {
        const metadata = await queryAll<TemplateMetadata>(
            MetadataType.Template
        );
        res.json(metadata);
        return;
    }
    if (req.path.includes(MetadataType.Component)) {
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

const postMetadata = async (
    req: Request<{}, {}, GenericMetadata>,
    res: Response<number | null | { message: string }>,
    next: NextFunction
): Promise<void> => {
    validate(req.body);
    console.log(
        `Going to post: ${JSON.stringify(req.path)} and data: ${JSON.stringify(
            req.body
        )}...`
    );
    if (req.path.includes(MetadataType.Galactic)) {
        const metadataId = await pushMetadata(MetadataType.Galactic, req.body);
        res.json(metadataId);
        return;
    }
    if (req.path.includes(MetadataType.Project)) {
        const metadataId = await pushMetadata(MetadataType.Project, req.body);
        res.json(metadataId);
        return;
    }
    if (req.path.includes(MetadataType.Page)) {
        const metadataId = await pushMetadata(MetadataType.Page, req.body);
        res.json(metadataId);
        return;
    }
    if (req.path.includes(MetadataType.Template)) {
        const metadataId = await pushMetadata(MetadataType.Template, req.body);
        res.json(metadataId);
        return;
    }
    if (req.path.includes(MetadataType.Component)) {
        const metadataId = await pushMetadata(MetadataType.Component, req.body);
        res.json(metadataId);
        return;
    }
    res.status(404).send({
        message: 'Path not found!',
    });
};

const initializeRoutes = async (app: Express) => {
    app.get('/home', getHome);
    app.get('/metadata/all/*', getAllMetadata);
    app.post('/metadata/post/*', postMetadata);
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
