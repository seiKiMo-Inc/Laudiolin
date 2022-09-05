import { Howl, Howler } from 'howler'
import { URL } from 'url'

/**
 * Checks if a string is a valid URL.
 * @param url The URL to check.
 */
const isValidURL = (url: string) => {
    try {
        new URL(url)
        return true
    } catch (e) {
        return false
    }
}

/**
 * A track.
 */
export class Track {
    /**
     * The URL to the track.
     */
    url: string

    /**
     * The Howl instance.
     */
    sound: Howl

    /**
     * Creates a new track.
     * @param url The URL to the track.
     */
    constructor (url: string) {
        this.url = url
        if (isValidURL(url)) throw new Error('Invalid URL.')
        this.sound = new Howl({ src: [url], html5: true })
    }
}
