import httpServer from './http-server';
import GameHandler from './game-handler';
import SocketLink from './socket-link';


const HTTP_PORT: number = Number(process.env.PORT) || 80;
const WEBSOCKET_PORT: number = Number(process.env.WSPORT) || 3000;

const gameHandler = new GameHandler();
gameHandler.loadGames(gameHandler.findGames());

const socketLink = new SocketLink(WEBSOCKET_PORT);

httpServer.get('/games/', (req, res) => {
    res.json(gameHandler.games);
});

// Start the Express server
httpServer.listen(HTTP_PORT, () => {
    console.log("Started express server at http://localhost")
});