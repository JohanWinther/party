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
            listEl.innerHTML += `<li><a href="${game.path}">${game.data.name}</a></li>`;
        });
    }).then(() => {

        var Anchors = document.getElementsByTagName("a");
    
        [...Anchors].forEach(anchor => {
            anchor.addEventListener("click", event => {
                event.preventDefault();
                document.body.classList.add('fadeOut');
                setTimeout(() => {
                    window.location = anchor.href;
                }, 1000);
                return false;
            }, false);
        });
    });
});