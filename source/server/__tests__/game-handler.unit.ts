jest.mock('fs');

import fs, { Dirent } from 'fs';
import gameHandler from '../game-handler';


test('findGames returns empty string array if game folder is missing', () => {
    fs.existsSync = jest.fn().mockReturnValue(false);

    expect(gameHandler.findGames()).toStrictEqual([] as string[]);
});

test('findGames returns empty string array if games folder is empty', () => {
    fs.existsSync = jest.fn().mockReturnValueOnce(true); // games folder exists
    fs.readdirSync = jest.fn().mockReturnValue([] as Dirent[]); // no entries in games folder

    expect(gameHandler.findGames()).toStrictEqual([] as string[]);
});
