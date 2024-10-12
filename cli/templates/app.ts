import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import * as middlewares from './middleware';
import router from './router';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(
    cors({
        origin: '*', // NOTE Adjust to your needs
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
    })
);
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/home', (req: express.Request, res: express.Response) => {
    res.json({
        message: 'success',
    });
});

app.use('/', router());

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
