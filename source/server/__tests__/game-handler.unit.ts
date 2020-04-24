import { mocked } from 'ts-jest/utils';
jest.mock('fs');

import fs from 'fs';
import path from 'path';
import GameHandler from '../game-handler';

describe('GameHandler', () => {

    it('should have empty game array upon creation', () => {
        const gameHandler = new GameHandler();
    
        expect(gameHandler.games).toStrictEqual([]);
    });

});

describe('findGames', () => {

    let gameHandler: GameHandler;
    const gamesFolderPath: fs.PathLike = path.join(__dirname, '../', 'games');

    beforeEach(() => {
        gameHandler = new GameHandler();
    });

    it('should return empty array if games folder does not exist', () => {
        mocked(fs.readdirSync).mockImplementation((inputPath: fs.PathLike): fs.Dirent[] => {
                throw new Error(`Uncaught Error: ENOENT: no such file or directory, scandir '${inputPath}'`)
        });

        expect(gameHandler.findGames()).toStrictEqual([]);
    });

    it('should return empty array if games folder is empty', () => {
        mocked(fs.readdirSync).mockReturnValue([] as fs.Dirent[]);

        expect(gameHandler.findGames()).toStrictEqual([]);
    });

    it('should return empty array if games folder does not have any folders', () => {
        const fileDirent = new fs.Dirent();
        fileDirent.isFile = (): boolean => true;
        fileDirent.isDirectory = (): boolean => false;
        mocked(fs.readdirSync).mockReturnValue([fileDirent]);

        expect(gameHandler.findGames()).toStrictEqual([]);
    });

    it('should return empty array if games folder has folders without game.json', () => {
        const fileDirent = new fs.Dirent();
        fileDirent.isFile = (): boolean => true;
        fileDirent.isDirectory = (): boolean => false;

        const folderDirent = new fs.Dirent();
        folderDirent.isFile = (): boolean => false;
        folderDirent.isDirectory = (): boolean => true;
        folderDirent.name = 'example.game';

        const existingPaths: fs.PathLike[] = [
            path.join(gamesFolderPath, folderDirent.name),
        ];

        mocked(fs.readdirSync).mockReturnValue([folderDirent, fileDirent]);
        mocked(fs.existsSync).mockImplementation((inputPath: fs.PathLike): boolean => 
            existingPaths.includes(inputPath)
        );

        expect(gameHandler.findGames()).toStrictEqual([]);
    });

    it('should return one path if games folder has one folder with game.json', () => {
        const fileDirent = new fs.Dirent();
        fileDirent.isFile = (): boolean => true;
        fileDirent.isDirectory = (): boolean => false;

        const folderDirent = new fs.Dirent();
        folderDirent.isFile = (): boolean => false;
        folderDirent.isDirectory = (): boolean => true;
        folderDirent.name = 'example.game';

        const existingPaths: fs.PathLike[] = [
            path.join(gamesFolderPath, folderDirent.name),
            path.join(gamesFolderPath, folderDirent.name, 'game.json'),
        ];

        mocked(fs.readdirSync).mockReturnValue([folderDirent, fileDirent]);
        mocked(fs.existsSync).mockImplementation((inputPath: fs.PathLike): boolean =>
            existingPaths.includes(inputPath)
        );

        expect(gameHandler.findGames()).toStrictEqual([
            path.join(gamesFolderPath, folderDirent.name, 'game.json')
        ]);
    });


    it('should return one path if games folder has one folder with game.json and one without', () => {
        const fileDirent = new fs.Dirent();
        fileDirent.isFile = (): boolean => true;
        fileDirent.isDirectory = (): boolean => false;

        const folderDirent1 = new fs.Dirent();
        folderDirent1.isFile = (): boolean => false;
        folderDirent1.isDirectory = (): boolean => true;
        folderDirent1.name = 'example.game1';

        const folderDirent2 = new fs.Dirent();
        folderDirent2.isFile = (): boolean => false;
        folderDirent2.isDirectory = (): boolean => true;
        folderDirent2.name = 'example.game2';

        const existingPaths: fs.PathLike[] = [
            path.join(gamesFolderPath, folderDirent1.name),
            path.join(gamesFolderPath, folderDirent1.name, 'game.json'),
            path.join(gamesFolderPath, folderDirent2.name),
        ];

        mocked(fs.readdirSync).mockReturnValue([folderDirent1, folderDirent2, fileDirent]);
        mocked(fs.existsSync).mockImplementation((inputPath: fs.PathLike): boolean =>
            existingPaths.includes(inputPath)
        );

        expect(gameHandler.findGames()).toStrictEqual([
            path.join(gamesFolderPath, folderDirent1.name, 'game.json')
        ]);
    });

    it('should return two paths if games folder has two folders with game.json', () => {
        const fileDirent = new fs.Dirent();
        fileDirent.isFile = (): boolean => true;
        fileDirent.isDirectory = (): boolean => false;

        const folderDirent1 = new fs.Dirent();
        folderDirent1.isFile = (): boolean => false;
        folderDirent1.isDirectory = (): boolean => true;
        folderDirent1.name = 'example.game1';

        const folderDirent2 = new fs.Dirent();
        folderDirent2.isFile = (): boolean => false;
        folderDirent2.isDirectory = (): boolean => true;
        folderDirent2.name = 'example.game2';

        const existingPaths: fs.PathLike[] = [
            path.join(gamesFolderPath, folderDirent1.name),
            path.join(gamesFolderPath, folderDirent1.name, 'game.json'),
            path.join(gamesFolderPath, folderDirent2.name),
            path.join(gamesFolderPath, folderDirent2.name, 'game.json'),
        ];

        mocked(fs.readdirSync).mockReturnValue([folderDirent1, folderDirent2, fileDirent]);
        mocked(fs.existsSync).mockImplementation((inputPath: fs.PathLike): boolean =>
            existingPaths.includes(inputPath)
        );

        expect(gameHandler.findGames()).toStrictEqual([
            path.join(gamesFolderPath, folderDirent1.name, 'game.json'),
            path.join(gamesFolderPath, folderDirent2.name, 'game.json')
        ]);
    });

});

describe('loadGames', () => {

    let gameHandler: GameHandler;
    const gamesFolderPath: fs.PathLike = path.join(__dirname, '../', 'games');

    beforeEach(() => {
        gameHandler = new GameHandler();
    });

    it('should make games property an empty array if no paths', () => {
        gameHandler.loadGames([]);
        expect(gameHandler.games).toStrictEqual([]);
    });

    
    it('should make games property an empty array if file at path does not exist', () => {
        mocked(fs.readFileSync).mockImplementation((inputPath: fs.PathLike): string => {
            throw new Error(`Uncaught Error: ENOENT: no such file or directory, scandir '${inputPath}'`);
        });

        gameHandler.loadGames([
            path.join(gamesFolderPath, 'example.game', 'game.json')
        ]);
        expect(gameHandler.games).toStrictEqual([]);
    });

    it('should make games property an empty array if game.json is not valid JSON', () => {
        mocked(fs.readFileSync).mockReturnValue("not a valid json string");

        gameHandler.loadGames([
            path.join(gamesFolderPath, 'example.game', 'game.json')
        ]);
        expect(gameHandler.games).toStrictEqual([]);
    });

    it('should make games property an empty array if game.json is missing required keys', () => {
        const gameData = {
            title: "Example Title",
        }
        mocked(fs.readFileSync).mockReturnValue(JSON.stringify(gameData));

        gameHandler.loadGames([
            path.join(gamesFolderPath, 'example.game', 'game.json')
        ]);
        expect(gameHandler.games).toStrictEqual([]);
    });

    /* Add tests for checking missing keys and wrong types */

});