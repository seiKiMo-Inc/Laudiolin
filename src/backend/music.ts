import {Howl, Howler} from "howler";

/**
 * Plays an audio track.
 * @param track The URL to the track.
 */
export function playTrack(track: string) {
    const sound = new Howl({
        src: [track],
        html5: true,
        onplay: () => {
            console.log("Playing track.");
        },
        onend: () => {
            console.log("Track ended.");
        }
    });

    sound.play(); Howler.volume(0.4);
}