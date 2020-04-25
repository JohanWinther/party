import fs from 'fs';
import path from 'path';

class Game {

    [key: string]: (
        string |
        boolean |
        URL |
        { name: string; link?: URL } |
        { min: number | null; max: number | null }
    );

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

    constructor(gameInfoPath: fs.PathLike) {
        this.isValid = this.parseGameInfoFile(gameInfoPath);
    }

    private parseGameInfoFile(gameInfoPath: fs.PathLike): boolean {
        let gameData;
        try {
            const fileText = fs.readFileSync(gameInfoPath, { encoding: 'utf-8' });
            gameData = JSON.parse(fileText);
        } catch (e) {
            return false;
        }

        this.url = `/games/${path.basename(path.dirname(gameInfoPath as string))}/`;

        if (gameData.title && typeof gameData.title === 'string') {
            this['title'] = gameData['title'];
            this.title = gameData.title;
        } else {
            return false;
        }

        if (gameData.description && typeof gameData.description === 'string') {
            this.description = gameData.description;
        } else {
            return false;
        }

        if (gameData.author &&
            typeof gameData.author === 'object' && 
            gameData.author.name &&
            typeof gameData.author.name === 'string') {
            
            this.author = {
                name: gameData.author.name
            }

            if (gameData.author.link && typeof gameData.author.link === 'string') {
                this.author.link = gameData.author.link;
            }
            
        } else {
            return false;
        }

        if (gameData.version && typeof gameData.version === 'string') {
            this.version = gameData.version;
        } else {
            return false;
        }

        if (gameData.supportLink && typeof gameData.supportLink === 'string') {
            this.supportLink = gameData.supportLink;
        }

        if (gameData.numberOfPlayers &&
            typeof gameData.numberOfPlayers === 'object') {
        /* Implement check later */
            this.numberOfPlayers = gameData.numberOfPlayers;
        } else {
            return false;
        }

        if (gameData.playTime &&
            typeof gameData.playTime === 'object') {
            /* Implement check later */
            this.playTime = gameData.playTime;
        } else {
            return false;
        }

        if (gameData.explicitContent !== undefined &&
            typeof gameData.explicitContent === 'boolean') {
            this.explicitContent = gameData.explicitContent;
        } else {
            return false;
        }

        if (gameData.audienceSupported !== undefined &&
            typeof gameData.audienceSupported === 'boolean') {
            this.audienceSupported = gameData.audienceSupported;
        } else {
            return false;
        }

        return true;
    }
}

class GameHandler {
    games: Game[];

    constructor() {
        this.games = [];
    }

    findGames(): fs.PathLike[] {
        const gamesFolderPath: fs.PathLike = path.join(__dirname, 'games');

        let direntsInGamesFolder: fs.Dirent[];
        try {
            direntsInGamesFolder = fs.readdirSync(gamesFolderPath, { withFileTypes: true });
        } catch (e) {
            return [];
        }
        const foldersInGamesFolder = direntsInGamesFolder.filter(dirent => dirent.isDirectory());
        if (foldersInGamesFolder.length === 0) {
            return [];
        }
        const gameInfoFilePaths: fs.PathLike[] = foldersInGamesFolder
            .map(dirent => path.join(gamesFolderPath, dirent.name, 'game.json'))
            .filter(gameInfoPath => fs.existsSync(gameInfoPath));

        return gameInfoFilePaths
    }

    loadGames(gameInfoFilePaths: fs.PathLike[]): void {
        this.games = gameInfoFilePaths
            .map(gameInfoPath => new Game(gameInfoPath))
            .filter(game => game.isValid);
    }
}

export = GameHandler