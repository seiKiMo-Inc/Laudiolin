import { Howl } from "howler";
import { URL } from "url";

/**
 * It returns true if the given string is a valid URL, and false otherwise
 * @param {string} url - The URL to validate.
 * @returns A boolean value.
 */
const isValidURL = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};

export class Song {
    url: string;
    title?: string;
    author?: string;
}

export class Track {
    Songs: Song[];
    sound: Howl;
    constructor (Songs: Song[]) {
        this.Songs = Songs;
        this.sound = new Howl({src: Songs[0].url, html5: true});
    }
}

