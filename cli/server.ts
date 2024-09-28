import express, { type Express } from 'express';
import { NextFunction, Request, Response } from 'express';
import { Config } from './config';

const initializeMiddlewares = (app: Express) => {
    app.use(express.json());
};

const getHome = async (
    req: Request,
    res: Response<{}>,
    next: NextFunction
): Promise<void> => {
    res.json({ ok: true });
};

const initializeRoutes = async (app: Express) => {
    app.get('/home', getHome);
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
