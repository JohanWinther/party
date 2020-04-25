import ws from 'ws';

interface SocketClients {
    [clientId: string]: ws;
}
export default class SocketLink {

    static SCREEN_CLIENT_ID = 0;
    _clients: SocketClients; 

    constructor(port: number) {
        this.resetClients();
        const webSocketServer = new ws.Server({ port: port });
        webSocketServer.on('connection', this.connect.bind(this));
    }

    private get clients(): SocketClients {
        return this._clients;
    }

    private getClient(clientId: number): ws {
        return this.clients[clientId.toString()];
    }

    private clientExists(clientId: number): boolean {
        return ( this.getClient(clientId) !== undefined );
    }

    private resetClients(): void {
        for (const id in this.clients) {
            this.removeClient(parseInt(id));
        }
        this._clients = {};
    }

    private addClient(connection: ws, clientId: number): void {
        console.log('ACCEPTING client:', clientId ? clientId : 'SCREEN');
        connection.onmessage = this.onMessage.bind(this, clientId);
        connection.onclose = this.onClose.bind(this, clientId);
        connection.send('ACCEPTED');
        this._clients[clientId.toString()] = connection;
    }

    private removeClient(clientId: number): void {
        this.getClient(clientId).close();
        delete this._clients[clientId.toString()];
    }

    private connect(connection: ws): void {
        console.log("Client connected. Waiting for identification.");
        connection.onmessage = this.sendAckUponClientId.bind(this, connection);
    }

    private sendAckUponClientId(connection: ws, message: MessageEvent): void {
        const messageText = message.data.toString();
        if (messageText.startsWith('ID:')) {
            const clientId = parseInt(messageText.split(':')[1]);
            if (!isNaN(clientId) && !this.clientExists(clientId)) {
                this.addClient(connection, clientId);
            } else {
                connection.send('REJECTED:socket already open in another window');
            }
        }
    }

    private onClose(clientId: number): void {
        this.removeClient(clientId);
    }

    private onMessage(clientId: number, message: MessageEvent): void {
        if (clientId === SocketLink.SCREEN_CLIENT_ID) {
            // If message from screen
            // Forward to all player clients
            for (const idString in this.clients) {
                const id = parseInt(idString);
                if (this.isPlayer(id)) {
                    this.clients[idString].send(message.data);
                }
            }
        } else {
            // If message from player
            // Send to screen client
            if (this.clientExists(SocketLink.SCREEN_CLIENT_ID)) {
                this.getClient(SocketLink.SCREEN_CLIENT_ID).send(message.data);
            }
        }
    }

    public isScreen(clientId: number): boolean {
        return (
            this.clientExists(clientId) &&
            clientId === SocketLink.SCREEN_CLIENT_ID
        );
    }

    public isPlayer(clientId: number): boolean {
        return (
            this.clientExists(clientId) &&
            clientId !== SocketLink.SCREEN_CLIENT_ID
        );
    }
}