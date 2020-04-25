import express from 'express';
import path from 'path';

const httpServer = express();

httpServer.use(
    '/',
    express.static(path.join(__dirname, 'client'))
);

httpServer.use(
    '/games',
    express.static(path.join(__dirname, 'games'))
);


export { httpServer };