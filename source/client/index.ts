console.log("Screen client");

interface Game {
    url: string;
    isValid: boolean;
    title: string;
    description: string;
    author: {
        name: string;
        link?: URL;
    };
    version: string;
    supportLink: URL;
    numberOfPlayers: {
        min: number | null;
        max: number | null;
    };
    playTime: {
        min: number | null;
        max: number | null;
    };
    explicitContent: boolean;
    audienceSupported: boolean;
}

function main(): void {

    const gamesList = document.getElementById('games');

    fetch('/games/')
        .then(res => res.json())
        .then(games => {
            gamesList.innerHTML = games.map((game: Game) => (`
                <li tabindex="0" title="${escape(game.description)}"><a href="${game.url}" tabindex="-1">${game.title}</a></li>
            `));
        });

}

function connect(): void {

    console.log('Connecting to websocket..');
    const ws = new WebSocket(`ws://${location.hostname}:3000`);

    ws.onopen = (): void => {
        console.log('Connected to websocket');
        const clientId = (new Date()).getTime()*100 + Math.floor(Math.random()*100);
        ws.send(clientId.toString());
        console.log(`Sending ${clientId}`);
    };
    ws.onclose = (): void => {
        setTimeout(() => {
            connect();
        }, 2000);
    };
    ws.onmessage = (ev): void => {
        console.log(ev.data);
    };

}

document.addEventListener('DOMContentLoaded', () => {
    main()
    connect();
});