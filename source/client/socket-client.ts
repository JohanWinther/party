import { set as setCookie, get as getCookie } from 'es-cookie';

export default class SocketClient extends EventTarget {

    webSocket: WebSocket;
    clientId: number;
    type: 'screen' | 'player';

    constructor() {
        super();

        if (['localhost', '127.0.0.1', '::1'].includes(location.hostname)) {
            this.type = 'screen';
            this.clientId = 0;
        } else {
            this.type = 'player';
            this.setClientId();
        }

        this.connect();
    }

    public send(event: { type: string; data: object }): void {
        if (event && typeof event === 'object' &&
            event.type && typeof event.type === 'string' &&
            event.data && typeof event.data === 'object') {

            if (this.webSocket) {
                this.webSocket.send(JSON.stringify(event));
            } else {
                console.log('Buffering message for later...');
                setTimeout(() => {
                    console.log('Buffering message for later... trying again.');
                    this.send(event);
                }, 1000);
            }

        } else {
            throw new Error('Event object has wrong format. Must have "type" and "data" keys.');
        }
    }

    private setClientId(): void {
        const cookieClientId: number = parseInt(getCookie('clientId'));
        if (!isNaN(cookieClientId)) {
            this.clientId = cookieClientId;
        } else {
            this.clientId = (new Date()).getTime() * 100 + Math.floor(Math.random() * 100);
            setCookie('clientId', this.clientId.toString(), { expires: 1 });
        }
    }

    connect(): void {
        console.log('Trying to connect.');
        const unconnectedWSClient = new WebSocket(`ws://${location.hostname}:3000`);

        unconnectedWSClient.onerror = (event): void => {
            event.preventDefault();
            console.log('Could not establish connection to websocket.');

        };

        unconnectedWSClient.onclose = (): void => {
            delete this.webSocket;
            console.log('Lost connection. Will try again in 1 second...');
            setTimeout(() => {
                this.connect();
            }, 1000);
        };

        unconnectedWSClient.onopen = (): void => {
            console.log(`Connected as ${this.clientId}`);
            this.webSocket = unconnectedWSClient;

            if (this.type === 'player') {
                const event = {
                    type: "player_connected",
                    data: {
                        clientId: this.clientId
                    }
                };
                this.webSocket.send(JSON.stringify(event));
            }


            this.webSocket.onmessage = (messageEvent: MessageEvent): void => {
                console.log('Received message:', messageEvent.data.toString());
                let event;
                try {
                    event = JSON.parse(messageEvent.data.toString());
                } catch (e) {
                    event = {
                        type: "unknown",
                        data: {
                            message: messageEvent.data.toString(),
                        }
                    };
                }

                if (event && typeof event === 'object' &&
                    event.type && typeof event.type === 'string' &&
                    event.data && typeof event.data === 'object') {
                    this.dispatchEvent(
                        new CustomEvent(event.type,
                            { detail: event.data }
                        )
                    );
                }
            };
        };
    }
}