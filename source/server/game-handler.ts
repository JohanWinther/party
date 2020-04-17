import fs from 'fs';
import path from 'path';


function findGames(): string[] {
    let games: string[];
    if (fs.existsSync(path.join(__dirname, 'games'))) {
        games = (
            fs.readdirSync(path.join(__dirname, 'games'), { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .filter(dirent => fs.existsSync(path.join(__dirname, 'games', dirent.name, 'game.json')))
                .map(dirent => `/games/${dirent.name}/`)
                )
            } else {
                games = [];
            }
            return games
        }
        
const gameHandler = {
    "findGames": findGames
}
        
export = gameHandler