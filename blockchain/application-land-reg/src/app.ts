import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import formRouter from './routes/forms';
import indexRouter from './routes/index';

if (!process.env.CERT) {
    throw Error(
        'Provide CERT environment variable with path to P12 Certificate to sign PDFs',
    );
}

if (!process.env.IPFS_CLUSTER) {
    throw Error(
        'Provide IPFS_CLUSTER environment variable with link to IPFS cluster node',
    );
}

const app = express();
const port = process.env.port || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
    '/bootstrap',
    express.static(
        path.join(__dirname, '../../../node_modules/bootstrap/dist'),
    ),
);
app.use(
    '/jquery',
    express.static(path.join(__dirname, '../../../node_modules/jquery/dist')),
);
app.use('/', indexRouter);
app.use('/form', formRouter);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let errorCode = err.error || 'server_err';
    let message = err.message || 'Internal Server Error';
    let stacktrace = err.stack || ' ';
    res.status(statusCode).send({
        success: false,
        error: {
            code: errorCode,
            message: message,
            stacktrace: stacktrace,
        },
    });
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
