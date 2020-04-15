import express from 'express';
import path from 'path';
import gameHandler from './game-handler';

const httpServer = express();
const games = gameHandler.findGames();
console.log(games);

httpServer.use(
    '/',
    express.static(
        path.join(__dirname, 'client')
    )
)

httpServer.use(
    '/games',
    express.static(
        path.join(__dirname, 'games')
    )
)

httpServer.get('/g', (req, res) => {
    res.json(games);
});

export = httpServer