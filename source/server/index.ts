import httpServer from './http-server';
import WebSocket from 'ws';

const HTTP_PORT: number = Number(process.env.PORT) || 80;
const WEBSOCKET_PORT: number = Number(process.env.WSPORT) || 3000;

const WebSocketServer = new WebSocket.Server({ port: WEBSOCKET_PORT });
WebSocketServer.on('connection', connection => {
    connection.onmessage = (e): void => {
        console.log(JSON.parse(e.data as string));
    };
    
    let i = 0;
    setInterval(() => {
        connection.send(JSON.stringify(
            {
                event: "ui_state",
                data: {
                    state: i++
                }
            }
        ));
    }, 1000);

});

// Start the Express server
httpServer.listen(HTTP_PORT, () => {
    console.log("Started express server at http://localhost")
});