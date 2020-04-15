console.log("Host client");

var app = {
    "games": [],
    "registerGame": (game) => this.games.push(game)
}

async function getGames() {
    let req = await fetch('/g');
    let gamesLinks = await req.json();
    let games = await Promise.all(gamesLinks.map(async link => {
        let req = await fetch(link + '/game.json');
        let game = await req.json();
        return {
            "path": link,
            "data": game
        }
    }));
    return games
}

document.addEventListener('DOMContentLoaded', () => {

    getGames().then(games => {
        let listEl = document.getElementById("games");
        games.forEach(game => {
            listEl.innerHTML += `<li tabindex="0" data-href="${game.path}">${game.data.name}</li>`;
        });
    }).then(() => {

        var Anchors = document.getElementById("games").children;
    
        [...Anchors].forEach(anchor => {
            anchor.addEventListener("touchend", startGame, false);
            anchor.addEventListener("click", startGame, false);
            anchor.addEventListener("keypress", startGame, false);
        });
    });
});

function startGame(event) {
    event.preventDefault();
    let target = event.target;
    target.focus();

    if (event.keyCode && ![13,32].includes(event.keyCode)) {
        return false;
    }

    document.body.classList.add('fadeOut');
    setTimeout(() => {
        window.location = target.dataset.href;
    }, 1000);
    return false;
}