import cors from 'cors';
import express, {
    NextFunction,
    Request,
    Response,
    type Express,
} from 'express';
import { startBackendApp, stopBackendApp } from './bootstrapper/backend';
import {
    runCreateReactApp,
    startViteApp,
    stopViteApp,
} from './bootstrapper/frontend';
import { attemptGetGhToken, getListOfOrgs } from './bootstrapper/git';
import { Config } from './config';
import {
    getResourceGroups,
    getResourcesInGroup,
    refreshAzureCredentials,
    terraformApply,
    terraformDestroy,
} from './routes/azureOps';
import {
    getAllFilesFromDb,
    getFileByIdFromDb,
    uploadFileHandler,
} from './routes/cmsHelper';
import {
    getComponentMetadata,
    getComponentMetadataById,
    getControllerMetadata,
    getControllerMetadataById,
    getGalacticMetadata,
    getGalacticMetadataById,
    getPageMetadata,
    getPageMetadataById,
    getProjectMetadata,
    getProjectMetadataById,
    getRouteMetadata,
    getRouteMetadataById,
    getTemplateMetadata,
    getTemplateMetadataById,
} from './routes/getMetadata';
import {
    patchComponentMetadata,
    patchGalacticMetadata,
    patchPageMetadata,
    patchProjectMetadata,
    patchTemplateMetadata,
} from './routes/patch_methods';
import { postComponentMetadata } from './routes/postComponentMetadata';
import { postControllerMetadata } from './routes/postControllerMetadata';
import { postDataSourceMetadataMetadata } from './routes/postDataSourceMetadata';
import { postGalacticMetadata } from './routes/postGalacticMetadata';
import { postPageMetadata } from './routes/postPageMetadata';
import { postProjectMetadata } from './routes/postProjectMetadata';
import { postRouteMetadata } from './routes/postRouteMetadata';
import { postTemplateMetadata } from './routes/postTemplateMetadata';

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

const notFoundHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const notFoundMessages = [
        'not found',
        'not found in db',
        'no project',
        'no data found',
    ];
    if (
        notFoundMessages
            .map((x) => err.message.toLowerCase().includes(x))
            .some((x) => x)
    ) {
        res.status(404).json({ error: `Resource not found: ${err.message}` });
        return;
    }
    next(err);
};

const defaultErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(500).json({ error: 'Internal Server Error' });
};

const initializeRoutes = async (app: Express) => {
    app.get('/home', getHome);
    // GET Metadata Routes
    app.get('/metadata/all/galactic', getGalacticMetadata);
    app.get('/metadata/all/project', getProjectMetadata);
    app.get('/metadata/all/page', getPageMetadata);
    app.get('/metadata/all/template', getTemplateMetadata);
    app.get('/metadata/all/component', getComponentMetadata);
    app.get('/metadata/all/route', getRouteMetadata);
    app.get('/metadata/all/controller', getControllerMetadata);

    app.get('/metadata/get/galactic', getGalacticMetadataById);
    app.get('/metadata/get/project', getProjectMetadataById);
    app.get('/metadata/get/page', getPageMetadataById);
    app.get('/metadata/get/template', getTemplateMetadataById);
    app.get('/metadata/get/component', getComponentMetadataById);
    app.get('/metadata/get/route', getRouteMetadataById);
    app.get('/metadata/get/controller', getControllerMetadataById);

    // POST Metadata Routes
    app.post('/metadata/post/galactic', postGalacticMetadata);
    app.post('/metadata/post/project', postProjectMetadata);
    app.post('/metadata/post/page', postPageMetadata);
    app.post('/metadata/post/template', postTemplateMetadata);
    app.post('/metadata/post/component', postComponentMetadata);
    app.post('/metadata/post/route', postRouteMetadata);
    app.post('/metadata/post/controller', postControllerMetadata);
    app.post('/metadata/post/dataSource', postDataSourceMetadataMetadata);

    // PATCH metadata routes
    app.patch('/metadata/patch/galactic', patchGalacticMetadata);
    app.patch('/metadata/patch/project', patchProjectMetadata);
    app.patch('/metadata/patch/page', patchPageMetadata);
    app.patch('/metadata/patch/template', patchTemplateMetadata);
    app.patch('/metadata/patch/component', patchComponentMetadata);

    // CMD routes
    app.post('/commands/boot/frontend/', runCreateReactApp);
    app.get('/commands/stopVite/', stopViteApp);
    app.get('/commands/startVite/', startViteApp);
    app.get('/commands/stopBackend/', stopBackendApp);
    app.get('/commands/startBackend/', startBackendApp);
    app.get('/commands/getGhPat/', attemptGetGhToken);
    app.get('/commands/getGhOrgs/', getListOfOrgs);

    // Content routes
    app.post('/content/upload', uploadFileHandler);
    app.get('/content/getAll', getAllFilesFromDb);
    app.get('/content/getById', getFileByIdFromDb);

    // Azure op routes
    app.get('/azure/refresh', refreshAzureCredentials);
    app.get('/azure/getResourceGroups', getResourceGroups);
    app.get('/azure/getResourcesInGroup', getResourcesInGroup);
    app.get('/azure/destroy', terraformDestroy);
    app.get('/azure/create', terraformApply);
};

export const listen = async () => {
    const app = express();
    initializeMiddlewares(app);
    const host = Config.ServerHost;
    const port = Config.ServerPort;
    await initializeRoutes(app);
    app.use(notFoundHandler);
    app.use(defaultErrorHandler);
    app.listen(port, host, () => {
        console.log(`Server running on port ${host}:${port}`);
    });
};
