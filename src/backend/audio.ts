import { emit, listen } from "@tauri-apps/api/event";
import { Howl, Howler } from "howler";
import { file } from "backend/fs";

import type { Event } from "@tauri-apps/api/helpers/event";
import type { FilePayload } from "backend/types";

let currentTrack: Track|undefined = null;

type PlayAudioPayload = FilePayload & {
    volume: number;
};

/**
 * Sets up event listeners.
 */
export async function setupListeners() {
    console.log("Setting up audio event listeners...");
    await listen("play_audio", playAudio);
}

/**
 * Plays an audio file.
 * @param event The event.
 */
function playAudio(event: Event<any>) {
    console.log("Event received.")
    console.log(event.payload);

    // Stop the current track if there is one.
    if(currentTrack) {
        currentTrack.stop();
    }

    // Create a new track.
    currentTrack = new Track(event.payload);
    // Play the track.
    currentTrack.play();
}

class Track {
    private howl: Howl;
    private id: number;

    constructor(payload: PlayAudioPayload) {
        this.howl = new Howl({
            src: [file(payload)],
            // volume: payload.volume,
        });
    }

    /**
     * Plays the track.
     * Sets the track's ID.
     */
    public play() {
        this.id = this.howl.play();
    }

    /**
     * Stops the track gracefully.
     */
    public stop() {
        // Fade out the track.
        this.howl.fade(1, 0, 1000, this.id);
        // Stop the track after the fade out.
        this.howl.stop();
    }
}