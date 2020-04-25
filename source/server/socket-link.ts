import ws from 'ws';

class SocketLink {

    websocketServer: ws.Server;
    screenClient: ws;
    playerClients: {
        [clientId: number]: ws;
    };

    constructor(port: number) {
        this.playerClients = {};

        this.websocketServer = new ws.Server({ port: port });
        this.websocketServer.on('connection', (connection, req) => {
            const hostname = req.connection.remoteAddress;
            if (['localhost', '127.0.0.1', '::1'].includes(hostname)) {
                // Screen client
                this.screenClient = connection;
            } else {
                // Player client
                connection.onmessage = (ev): void => {
                    const clientId = parseInt(ev.data.toString());
                    if (!isNaN(clientId)) {
                        this.playerClients[clientId] = connection;
                        console.log(`Client ${clientId} identified!`)
                    }
                };
            }
        });

        setInterval(() => {
            for (const a in this.playerClients) {
                this.playerClients[a].send('I hear you!');
            }
        }, 5000);
    }
}

export = SocketLink;