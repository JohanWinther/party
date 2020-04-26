import { set as setCookie, get as getCookie } from 'es-cookie';

export interface SocketEvent {
    type: string;
    data: object;
}

export class SocketClient extends EventTarget {

    static SCREEN_CLIENT_ID = 0;

    _webSocket: WebSocket;
    _clientId: number;

    constructor() {
        super();

        if (['localhost', '127.0.0.1', '::1'].includes(location.hostname)) {
            this.setClientId('screen');
        } else {
            this.setClientId('player');
        }

        this.connect();
    }


    public send(event: SocketEvent): void {
        console.log('Trying to send', event);
        if (this.webSocket) {
            this.webSocket.send(this.createMessageFromEvent(event));
            console.log('Sent', event);
        } else {
            console.log('Not connected to server. Retry in 1 second.');
            setTimeout(() => {
                this.send(event);
            }, 1000);
        }
    }

    private set webSocket(connection: WebSocket | undefined) {
        if (connection !== undefined) {
            connection.onmessage = this.onMessage.bind(this);
            this._webSocket = connection;
            this.dispatchEvent(new CustomEvent(
                'self_connected',
                { detail: {} }
            ));
            if (this.isPlayer) {
                this.send({ type: 'player_connected', data: { clientId: this.clientId } } as SocketEvent);
            }
        } else {
            this.webSocket.close();
            delete this._webSocket;
        }
    }

    private get webSocket(): WebSocket {
        return this._webSocket;
    }

    private setClientId(type: 'screen' | 'player'): void {
        const cookieClientId: number = parseInt(getCookie('clientId'));
        if (!isNaN(cookieClientId)) {
            this._clientId = cookieClientId;
        } else {
            if (type === 'screen') {
                this._clientId = SocketClient.SCREEN_CLIENT_ID;
            } else if (type === 'player') {
                this._clientId = (new Date()).getTime() * 100 + Math.floor(Math.random() * 100);
            }
            setCookie('clientId', this._clientId.toString(), { expires: 1 });
        }
    }

    private get clientId(): number {
        return this._clientId;
    }

    public get isScreen(): boolean {
        return (this.clientId === SocketClient.SCREEN_CLIENT_ID);
    }

    public get isPlayer(): boolean {
        return (this.clientId !== SocketClient.SCREEN_CLIENT_ID);
    }

    private connect(): void {
        const connection = new WebSocket(`ws://${location.hostname}:3000`);

        // Setup simple event handlers until client is accepted
        connection.onopen = (): void => {
            console.log('Attempting handshake...');
            connection.send("ID:" + this.clientId);
        };
        connection.onmessage = this.waitForServerAck.bind(this, connection);
        connection.onclose = this.onClose.bind(this);
    }


    private waitForServerAck(connection: WebSocket, messageEvent: MessageEvent): void {
        const messageText = messageEvent.data.toString();
        if (messageText === 'ACCEPTED') {
            console.log('Accepted by node server.');
            this.webSocket = connection;
        } else if (messageText.startsWith('REJECTED:')) {
            const rejectionReason: string = messageText.split(':')[1];
            console.log('Rejected by node server:', rejectionReason);
            // Add later: close with manual code
            connection.close();
            alert('Already open in another window!'); // Todo: fix better UI for this state
        }
    }

    private onClose(event: CloseEvent): void {
        if (this.webSocket) {
            this.webSocket = undefined;
        }

        // Add later: check that connection is not manually closed with custom code
        if (event.code !== 1005) {
            setTimeout(() => {
                this.connect();
            }, 1000);
        }
    }

    private onMessage(messageEvent: MessageEvent): void {
        const messageText = messageEvent.data.toString();
        const socketEvent = this.createEventFromMessage(messageText);
        const emitEvent = new CustomEvent(socketEvent.type, { detail: socketEvent.data });
        this.dispatchEvent(emitEvent);
    }

    private createMessageFromEvent(event: SocketEvent): string {
        return JSON.stringify(event);
    }

    private createEventFromMessage(message: string): SocketEvent {
        let event: SocketEvent;
        try {
            event = JSON.parse(message);
            if (event && typeof event === 'object' &&
                event.type && typeof event.type === 'string' &&
                event.data && typeof event.data === 'object') {
                return event;
            } else {
                throw new Error('Malformed event message.');
            }
        } catch (e) {
            event = {
                type: "unknown",
                data: {
                    message: message,
                }
            };
            return event;
        }
    }
}