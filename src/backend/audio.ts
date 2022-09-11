import { emit, listen } from "@tauri-apps/api/event";
import { Howl, Howler } from "howler";
import { file } from "@backend/fs";

import type { Event } from "@tauri-apps/api/helpers/event";
import type { FilePayload } from "@backend/types";

let currentTrack: Track|null = null;

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
 * Returns the currently playing track.
 */
export function getCurrentTrack(notNull: boolean = false): Track|null {
    if(notNull && !currentTrack) {
        return new Track({
            file_path: "https://app.magix.lol/download?id=RF9fEOz6LNU&source=YouTube",
            volume: 1.0
        });
    }

    return currentTrack;
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

export class Track {
    private howl: Howl;
    private id: number = 0;

    constructor(payload: PlayAudioPayload) {
        this.howl = new Howl({
            src: [file(payload)],
            volume: payload.volume
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

    /**
     * Mutes the track.
     */
    public mute() {
        this.howl.mute(true);
    }

    /**
     * Disables mute on the track.
     */
    public unmute() {
        this.howl.mute(false);
    }

    /**
     * Sets the playback time of the track.
     * @param time The time to set.
     * @return The current (or new) track time.
     */
    public seek(time?: number): number {
        return time ? this.howl.seek(time) : this.howl.seek();
    }

    /**
     * Gets the track's total run time.
     */
    public duration(): number {
        return this.howl.duration();
    }

    /**
     * Sets the volume of the track.
     * @param volume The volume to set.
     * @deprecated Use {@link Howler#volume} instead.
     */
    public volume(volume: number) {
        this.howl.volume(volume);
    }

    /**
     * Pauses the track.
     */
    public pause() {
        this.howl.pause();
    }

    /**
     * Resumes the track.
     */
    public resume() {
        this.howl.play();
    }

    /**
     * Checks if the track is playing.
     */
    public isPlaying() {
        return this.howl.playing();
    }
}