import httpServer from './http-server';

const HTTP_PORT: number = Number(process.env.PORT) || 80;
const WEBSOCKET_PORT: number = Number(process.env.WSPORT) || 3000;

// Start the Express server
httpServer.listen(HTTP_PORT, () => {
    console.log("Started express server at http://localhost")
});