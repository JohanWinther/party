console.log("Screen client");

function main(): void {

    const gamesList = document.getElementById('games');

    fetch('/games/')
        .then(res => res.json())
        .then(games => {
            gamesList.innerHTML = games.map((game) => (`
                <li tabindex="0"><a href="${game.url}" tabindex="-1">${game.title}</a></li>
            `));
        });

}

document.addEventListener('DOMContentLoaded', () => {
    main()
});