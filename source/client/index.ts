import { SocketClient } from "./socket-client";
import { GameInterface } from "../server/game-handler";

function main(): void {

    const gamesList = document.getElementById('games');

    fetch('/games/')
        .then(res => res.json())
        .then(games => {
            gamesList.innerHTML = games.map((game: GameInterface) => (`
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

main();