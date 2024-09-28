import express, { type Express } from 'express';
import { NextFunction, Request, Response } from 'express';
import { Config } from './config';
import {
  getGalacticMetadata,
  getProjectMetadata,
  getPageMetadata,
  getTemplateMetadata,
  getComponentMetadata,
  postGalacticMetadata,
  postProjectMetadata,
  postPageMetadata,
  postTemplateMetadata,
  postComponentMetadata,
} from './routes/metadata'

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

const initializeRoutes = async (app: Express) => {
    app.get('/home', getHome);
    // GET Metadata Routes
    app.get('/metadata/all/galactic', getGalacticMetadata);
    app.get('/metadata/all/project', getProjectMetadata);
    app.get('/metadata/all/page', getPageMetadata);
    app.get('/metadata/all/template', getTemplateMetadata);
    app.get('/metadata/all/component', getComponentMetadata);

    // POST Metadata Routes
    app.post('/metadata/post/galactic', postGalacticMetadata);
    app.post('/metadata/post/project', postProjectMetadata);
    app.post('/metadata/post/page', postPageMetadata);
    app.post('/metadata/post/template', postTemplateMetadata);
    app.post('/metadata/post/component', postComponentMetadata);
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
