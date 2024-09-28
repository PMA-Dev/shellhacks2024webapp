import express, { type Express } from 'express';
import { NextFunction, Request, Response } from 'express';
import { Config } from './config';
import cors from 'cors';
import {
    getGalacticMetadata,
    getProjectMetadata,
    getPageMetadata,
    getTemplateMetadata,
    getComponentMetadata,
    getGalacticMetadataById,
    getProjectMetadataById,
    getPageMetadataById,
    getTemplateMetadataById,
    getComponentMetadataById,
    postGalacticMetadata,
    postProjectMetadata,
    postPageMetadata,
    postTemplateMetadata,
    postComponentMetadata,
    patchGalacticMetadata,
    patchProjectMetadata,
    patchPageMetadata,
    patchTemplateMetadata,
    patchComponentMetadata,
} from './routes/metadata';

const initializeMiddlewares = (app: Express) => {
    app.use(express.json());
    app.use(cors());
};

const getHome = async (
    req: Request,
    res: Response<{ ok: boolean }>,
    next: NextFunction
): Promise<void> => {
    res.json({ ok: true });
};

const initializeRoutes = async (app: Express) => {
    app.get('/home', getHome);
    // GET Metadata Routes
    app.get('/metadata/all/galactic', getGalacticMetadata);
    app.get('/metadata/all/project', getProjectMetadata);
    app.get('/metadata/all/page', getPageMetadata);
    app.get('/metadata/all/template', getTemplateMetadata);
    app.get('/metadata/all/component', getComponentMetadata);

    app.get('/metadata/get/galactic', getGalacticMetadataById);
    app.get('/metadata/get/project', getProjectMetadataById);
    app.get('/metadata/get/page', getPageMetadataById);
    app.get('/metadata/get/template', getTemplateMetadataById);
    app.get('/metadata/get/component', getComponentMetadataById);

    // POST Metadata Routes
    app.post('/metadata/post/galactic', postGalacticMetadata);
    app.post('/metadata/post/project', postProjectMetadata);
    app.post('/metadata/post/page', postPageMetadata);
    app.post('/metadata/post/template', postTemplateMetadata);
    app.post('/metadata/post/component', postComponentMetadata);

    // PATCH metadata routes
    app.patch('/metadata/patch/galactic', patchGalacticMetadata);
    app.patch('/metadata/patch/project', patchProjectMetadata);
    app.patch('/metadata/patch/page', patchPageMetadata);
    app.patch('/metadata/patch/template', patchTemplateMetadata);
    app.patch('/metadata/patch/component', patchComponentMetadata);
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
