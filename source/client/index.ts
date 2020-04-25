import SocketClient from "./socket-client";

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
                <li tabindex="0" title="${escape(game.description)}">
                    <a href="${game.url}" tabindex="-1">${game.title}</a>
                </li>
            `));
        });

}

const socketClient = new SocketClient();

socketClient.addEventListener('player_connected', (event: CustomEvent) => {
    console.log(event);
});

socketClient.addEventListener('unknown', (event: CustomEvent) => {
    console.log(event);
});



document.addEventListener('DOMContentLoaded', () => {
    main()
});