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
                console.log("Screen connected.");
                this.screenClient = connection;

                
                this.screenClient.onmessage = (event): void => {

                    // Send event to all player clients
                    for (const clientId in this.playerClients) {
                        this.playerClients[clientId].send(event.data);
                    }

                };
            } else {
                console.log("Unknown player connected.");
                // Player client
                connection.send('Please identify yourself.');

                connection.onmessage = (messageEvent): void => {

                    // Send event to screen client
                    if (this.screenClient) {
                        this.screenClient.send(messageEvent.data);
                    }

                    /* Add player to instance if player_connected event is received */
                    const event = JSON.parse(messageEvent.data.toString());
                    if (event && typeof event === 'object' &&
                        event.type && typeof event.type === 'string' &&
                        event.data && typeof event.data === 'object') {
                        
                        if (event.type === 'player_connected' &&
                            event.data.clientId && typeof event.data.clientId === 'number') {
                            const clientId = event.data.clientId;
                            this.playerClients[clientId] = connection;
                            console.log(`Client ${clientId} identified!`);
                        }
                    }
                };
            }
        });

        // Ping
        setInterval(() => {
            for (const a in this.playerClients) {
                this.playerClients[a].send(JSON.stringify({
                    type: "ping",
                    data: {},
                }));
            }
        }, 5000);
    }
}

export = SocketLink;