import { set as setCookie, get as getCookie } from 'es-cookie';

export default class Communicator extends EventTarget {

    PORT: number;
    ws: WebSocket;
    clientId: number;

    constructor(port: number) {
        super();
        this.PORT = port;
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            this.clientId = 0;
        } else {

            const cookieClientId: number = parseInt(getCookie('clientId'));
            if (!isNaN(cookieClientId)) {
                this.clientId = cookieClientId;
            } else {
                this.clientId = (new Date).getTime() * 100 + Math.floor(Math.random() * 100);
                setCookie('clientId', this.clientId.toString(), { expires: 1 });
            }

        }


        this.connect();
    }
    

    connect(): void {
        const reconnect = (e: Event): void => {
            console.log('Websocket disconnected', e);
            setTimeout(() => {
                this.connect();
            }, 1000);
        };
        this.ws = new WebSocket(`ws://${location.hostname}:${this.PORT}`);
        console.log('Websocket created');

        this.ws.onclose = reconnect;
        this.ws.onmessage = (e: MessageEvent): void => {
            const eventData = JSON.parse(e.data);
            const newEvent: CustomEvent = new CustomEvent(
                eventData.event,
                { detail: eventData.data }
            );
            this.dispatchEvent(newEvent);
        };
        this.ws.onopen = (): void => {
            console.log('Websocket connected');
            let joinEvent;
            if (this.clientId !== 0) {
                joinEvent = {
                    event: 'player_connected',
                    data: {
                        clientId: this.clientId,
                    },
                }
            } else {
                joinEvent = {
                    event: 'screen_connected',
                    data: {},
                }
            }
            this.ws.send(JSON.stringify(joinEvent));
        };
    }
}