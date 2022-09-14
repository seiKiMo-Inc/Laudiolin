import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { Howl, Howler } from "howler";
import { EventEmitter } from "events";

import { file } from "@backend/fs";

import type { Event } from "@tauri-apps/api/helpers/event";
import type { FilePayload, SearchResult, VolumePayload } from "@backend/types";

/**
 * Events:
 * - start: Emitted when a track starts playing.
 * - stop: Emitted when the player stops playing or when there are no more tracks.
 * - pause: Emitted when the player is paused.
 * - resume: Emitted when the player is resumed.
 * - end: Emitted when the current playing song ends.
 * - seek: Emitted when the player seeks to a new position.
 * - volume: Emitted when the player's volume changes.
 * - mute: Emitted when the player is muted.
 * - unmute: Emitted when the player is unmuted.
 * - queued: Emitted when a track is queued.
 */
export class MusicPlayer extends EventEmitter {
    private readonly trackQueue: Track[] = [];
    private currentTrack: Track|null = null;
    private isPaused: boolean = true;
    private volume: number = 100;

    private originalVolume: number = -1;

    constructor() {
        super();
    }

    /*
     * Event listener utilities.
     */

    /**
     * Sets event listeners on the player's current track.
     * @param track The track to set the listeners on.
     * @private
     */
    private setupTrackListeners(track: Track) {
        const handle = track.getHandle();

        handle.on("end", () => {
            // Emit end event.
            this.emit("end", track);
            // Play the next track.
            this.playNext();
        });
    }

    /**
     * Plays the next track in the player's queue.
     * If there are no more tracks, the player will stop.
     * @private
     */
    private playNext() {
        // Check if there is already a song playing.
        if(this.currentTrack) {
            // Stop the current track.
            this.currentTrack.stop();
        }

        // Check if there are any tracks in the queue.
        if(this.trackQueue.length > 0) {
            // Play the next track in the queue.
            this.playTrack(this.trackQueue.shift()!);
        } else {
            // Emit stop event.
            this.emit("stop");
        }
    }

    /*
     * Track utilities.
     */

    /**
     * Returns the currently playing track.
     */
    getCurrentTrack(): Track {
        return this.currentTrack;
    }

    /**
     * Returns the track queue.
     */
    getTrackQueue(): Track[] {
        return this.trackQueue;
    }

    /**
     * Returns the total duration of the playing track.
     * @returns -1 if there is no track playing.
     */
    getDuration(): number {
        if(!this.currentTrack) return -1;
        return this.currentTrack.duration();
    }

    /**
     * Returns the current progress of the playing track.
     * @returns -1 if there is no track playing.
     */
    getProgress(): number {
        if(!this.currentTrack) return -1;
        return this.getCurrentTrack().seek();
    }

    /*
     * Player utilities.
     */

    /**
     * Returns the currently playing track.
     * @param track The track to play.
     * @param stopCurrent Whether to stop the current track.
     */
    playTrack(track: Track, stopCurrent = false) {
        // Set the current track.
        this.currentTrack = track;

        // Stop the current track if there is one.
        if(stopCurrent && this.currentTrack.isPlaying()) {
            this.currentTrack.stop();
            // Emit queued event.
            this.emit("queued", track);
        } else {
            // Play the track.
            this.currentTrack.play();
            // Set the player as unpaused.
            this.isPaused = false;
            // Emit start event.
            this.emit("start", track);
        }
    }

    /**
     * Haults the player's currently playing track.
     */
    stopTrack() {
        if(!this.currentTrack) return;

        // Stop the current track.
        this.currentTrack.stop();
        // Set the current track to null.
        this.currentTrack = null;
        // Set the player as paused.
        this.isPaused = true;

        // Emit stop event.
        this.emit("stop");
    }

    /**
     * Skips to the next track.
     */
    skipTrack() {
        // Play the next track.
        this.playNext();
    }

    /**
     * Returns the state of the player playing.
     */
    isPlaying(): boolean {
        return !this.isPaused;
    }

    /**
     * Pauses the player's currently playing track.
     */
    pause() {
        if(!this.currentTrack) return;

        // Pause the current track.
        this.currentTrack.pause();
        // Set the player as paused.
        this.isPaused = true;
        // Emit pause event.
        this.emit("pause");
    }

    /**
     * Resumes the player's currently playing track.
     */
    resume() {
        if(!this.currentTrack) return;

        // Resume the current track.
        this.currentTrack.resume();
        // Set the player as unpaused.
        this.isPaused = false;
        // Emit resume event.
        this.emit("resume");
    }

    /**
     * Returns the volume of the player. (out of 100)
     */
    getVolume(): number {
        return this.volume;
    }

    /**
     * Sets the volume of the player.
     * @param volume The volume to set the player to. (out of 100)
     */
    setVolume(volume: number) {
        // Set the player's volume.
        Howler.volume(volume);
        // Emit volume event.
        this.emit("volume", volume);
    }

    /**
     * Mutes the player from playing.
     */
    mute() {
        // Set the original player volume.
        this.originalVolume = this.volume;
        // Set the player's volume to 0.
        this.setVolume(0);

        // Emit mute event.
        this.emit("mute");
    }

    /**
     * Unmutes the player from playing.
     */
    unmute() {
        // Set the player's volume to the original volume.
        this.setVolume(this.originalVolume);
        // Set the original volume to -1.
        this.originalVolume = -1;

        // Emit unmute event.
        this.emit("unmute");
    }
}

/**
 * Represents a wrapped {@link Howl} instance.
 */
export class Track {
    private readonly howl: Howl;
    private id: number = 0;

    constructor(payload: PlayAudioPayload) {
        this.howl = new Howl({
            src: [file(payload)],
            volume: payload.volume
        });
    }

    /**
     * Returns the track handle.
     */
    public getHandle(): Howl {
        return this.howl;
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

/*
 * Constants & Utility methods.
 */

let currentTrack: Track|null = null;
export const player: MusicPlayer = new MusicPlayer();

type PlayAudioPayload = FilePayload & VolumePayload;

/**
 * Sets up event listeners.
 */
export async function setupListeners() {
    console.log("Setting up audio event listeners...");
    await listen("play_audio", playAudio);
    await listen("set_volume", updateVolume);
}

/**
 * Play an audio track from a search result.
 * @param track The search result of the track to play.
 */
export async function playFromResult(track: SearchResult): Promise<Track> {
    // TODO: Check settings for if user wants to download or stream audio.

    // Download the audio file.
    // TODO: Check settings for the user's preferred search engine.
    await invoke("play_from", { track });

    // Return the track.
    return currentTrack;
}

/**
 * Pauses/unpauses the current track.
 * @deprecated Use {@link MusicPlayer#pause} instead.
 */
export function togglePlayback() {
    if(!currentTrack) return;

    if(currentTrack.isPlaying())
        currentTrack.pause();
    else currentTrack.resume();
}

/**
 * Sets the player's volume.
 * Emits a volume packet to the gateway.
 * @param volume The volume.
 * @deprecated Use {@link MusicPlayer#setVolume} instead.
 */
export function setVolume(volume: number) {
    player.setVolume(volume);
}

/**
 * Plays an audio file.
 * @param event The event.
 */
function playAudio(event: Event<any>) {
    // Create a new track.
    const track = new Track(event.payload);
    // Add the track to the player.
    player.playTrack(track);
}

/**
 * Sets the global player volume.
 * @param event The event.
 */
function updateVolume(event: Event<any>) {
    // Parse the payload from the event.
    const payload: VolumePayload = event.payload;

    // Set the volume.
    Howler.volume(payload.volume);
}