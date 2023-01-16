import { Howl, Howler } from "howler";
import { EventEmitter } from "events";

import type { SearchResult, TrackData, VolumePayload, Playlist, SearchEngine } from "@backend/types";

import { AccessDetails } from "@app/constants";
import { SyncMessage } from "@backend/gateway";

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
 * - update: Emitted every 100ms when a track is playing.
 */
export class MusicPlayer extends EventEmitter {
    private readonly updateTask: any;

    private readonly backTrackQueue: Track[] = [];
    private readonly trackQueue: Track[] = [];
    private currentTrack: Track | null = null;
    private volume: number = 100;

    private loading: boolean = false;
    private originalVolume: number = -1;
    private isPaused: boolean = true;
    private isLooped: number = 0; // 0 = no loop, 1 = loop track, 2 = loop queue

    constructor() {
        super();

        this.updateTask = setInterval(() => {
            // Emit update event.
            this.emitUpdate();
        }, 100);
    }

    /*
     * Event listener utilities.
     */

    /**
     * Emits an update event.
     */
    private emitUpdate(): void {
        if (this.currentTrack == null || this.isPaused) return;

        this.emit("update", {
            track: this.currentTrack,
            progress: this.getProgress()
        });
    }

    /**
     * Sets event listeners on the player's current track.
     * @param track The track to set the listeners on.
     * @private
     */
    private setupTrackListeners(track: Track) {
        const handle = track.getHandle();

        handle.on("play", () => {
            const handleId = handle["id"] ?? "none";
            const trackId = this.currentTrack.getHandle()["id"] ?? "none";

            // Check if the track should be playing.
            if (handleId != trackId) {
                handle.stop();
            }
        });

        handle.on("end", () => {
            // Set the player as paused.
            this.isPaused = true;
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
        const current = this.currentTrack;

        // Check if there is already a song playing.
        if (this.currentTrack) {
            // Stop the current track.
            this.currentTrack.stop();
        }

        // Check the loop state.
        if (this.isLooped == 1) {
            // Loop the current track.
            current && this.playTrack(current.clone());
            return;
        }

        // Check if the track should be added back to the queue.
        if (this.isLooped == 2) {
            // Add the current track to the backtrack queue.
            current && this.trackQueue.push(current.clone());
        }

        // Check if there are any tracks in the queue.
        if (this.trackQueue.length > 0) {
            // Play the next track in the queue.
            this.playTrack(this.trackQueue.shift()!);
        } else {
            // Clear the player.
            this.clearPlayer();
            // Emit stop event.
            this.emit("stop");

            // Add the current track to the backtrack queue.
            current && this.backTrackQueue.push(current.clone());
        }
    }

    /*
     * Player utilities.
     */

    /**
     * Check if the player is loading.
     */
    isLoading(): boolean {
        return this.loading;
    }

    /**
     * Toggle the player's loading state.
     */
    toggleLoading(): boolean {
        return (this.loading = !this.loading);
    }

    /**
     * Shuffle the track queue.
     */
    shuffle(): void {
        // Shuffle the track queue.
        this.trackQueue.sort(() => Math.random() - 0.5);
    }

    /**
     * Returns the state of the player being paused.
     */
    getLoopState(): number {
        return this.isLooped;
    }

    /**
     * Sets the player's loop state.
     * @param state The loop state to set.
     */
    setLoopState(state: number) {
        this.isLooped = state;
    }

    /**
     * Clears the player's current status.
     */
    clearPlayer(): void {
        // Clear the current track.
        this.currentTrack = null;
        // Clear the track queue.
        this.trackQueue.length = 0;
        // Clear the backtrack queue.
        this.backTrackQueue.length = 0;
        // Set the player as paused.
        this.isPaused = true;
    }

    /**
     * Returns the currently playing track.
     */
    getCurrentTrack(): Track | null {
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
        if (!this.currentTrack) return -1;
        return this.currentTrack.duration();
    }

    /**
     * Sets the current song progress.
     * @param progress The progress to seek to.
     */
    setProgress(progress: number) {
        if (!this.currentTrack) return;

        // Seek to the given progress.
        this.currentTrack.seek(progress);
        // Emit seek event.
        this.emit("seek", progress);
    }

    /**
     * Returns the current progress of the playing track.
     * @returns -1 if there is no track playing.
     */
    getProgress(): number {
        if (!this.currentTrack) return -1;
        return this.getCurrentTrack().seek(null);
    }

    /*
     * Playlist utilities.
     */

    /**
     * Adds the playlist to the queue.
     * Plays the first track if specified.
     * @param playlist The playlist to add to the queue.
     * @param autoPlay Should the first playlist track automatically play?
     */
    public async queuePlaylist(playlist: Playlist, autoPlay = true) {
        // Check player state.
        if (autoPlay && this.isPlaying()) {
            this.stopTrack();
            this.clearPlayer();
        }

        let first = true;
        const queue = result => {
            // Queue the track if it is playable.
            if (result) {
                this.playTrack(result, first);
                if (first) first = false;
            }
        };

        // Extract the playable tracks.
        for (const track of playlist.tracks) {
            makeTrack(track).then(queue);
        }
    }

    /*
     * Track utilities.
     */

    /**
     * Returns the currently playing track.
     * @param track The track to play.
     * @param stopCurrent Whether to stop the current track.
     */
    playTrack(track: Track, stopCurrent = true) {
        // Check if the track should be added to the queue.
        if (!stopCurrent && this.currentTrack) {
            // Add track to the queue.
            this.trackQueue.push(track);
            // Emit queued event.
            this.emit("queued", track);
            return;
        }

        // Check if a track is loaded.
        if(this.currentTrack) {
            // Push the current track to the backtrack queue.
            this.backTrackQueue.push(this.currentTrack.clone());
        }

        // Stop the current track.
        if (this.isPlaying()) {
            // Stop the current track.
            this.stopTrack();
        }

        // Apply event listeners.
        this.setupTrackListeners(track);
        // Set the current track.
        this.currentTrack = track;

        // Play the track.
        this.currentTrack.play();
        // Set the player as unpaused.
        this.isPaused = false;
        // Set the player as loading.
        this.loading = true;
        // Emit start event.
        this.emit("start", track);
    }

    /**
     * Haults the player's currently playing track.
     */
    stopTrack() {
        if (!this.currentTrack) return;

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
     * Returns to the most previous track.
     * If in the middle of playing, return to the start of this track.
     */
    backTrack() {
        // Check if there is a track loading.
        if (this.loading) return;

        // Check if there is a track playing.
        if (this.currentTrack && this.getProgress() > 3) {
            // Seek to the start of the track.
            this.setProgress(0);
            return;
        }

        // Check if there are any tracks in the backtrack queue.
        if (this.backTrackQueue.length > 0) {
            // Stop the current track.
            // Prevents backtracking loop.
            this.stopTrack();
            // Get the previous track.
            const track = this.backTrackQueue.pop();
            // Play the previous track.
            this.playTrack(track!);
            // Add the track to the queue.
            this.trackQueue.unshift(track!);
        }
    }

    /**
     * Skips to the next track.
     */
    skipTrack() {
        // Check if a track is loaded.
        if (!this.currentTrack) return;
        if (this.loading) return;
        // Play the next track.
        this.playNext();
    }

    /**
     * Returns the state of the player playing.
     */
    isPlaying(): boolean {
        return this.currentTrack ? this.currentTrack.isPlaying() : !this.isPaused;
    }

    /**
     * Toggles the player's mute state.
     */
    togglePlayback() {
        if (!this.currentTrack) return;
        if (this.loading) return;

        if (this.isPlaying()) this.pause();
        else this.resume();
    }

    /**
     * Pauses the player's currently playing track.
     */
    pause() {
        if (!this.currentTrack) return;

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
        if (!this.currentTrack) return;

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
        Howler.volume(volume / 100);
        this.volume = volume;
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
    private readonly data: TrackData;
    private id: number = 0;

    constructor(private readonly payload: PlayAudioPayload) {
        this.howl = new Howl({
            html5: true,
            preload: "metadata",
            format: "mp3",
            src: [payload.url],
            volume: payload.volume
        });

        this.data = payload.track_data;
    }

    /**
     * Returns a shallow clone of this track.
     */
    public clone(): Track {
        return new Track(this.payload);
    }

    /**
     * Returns the track's data.
     */
    public getData(): TrackData {
        return this.data;
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
        let end = setTimeout(() => {
            // If the track is still loading, stop it.
            if (this.id == 0) {
                this.stop();
                clearTimeout(timeout);
                clearTimeout(end);
            }
        }, 3000);

        let timeout = setTimeout(() => {
            clearTimeout(end);

            player.isLoading() && (this.id == 0) &&
            (this.howl["id"] = this.id =
                this.howl.play()) && player.toggleLoading();
        }, 500);

        this.howl.once("load", () => {
            clearTimeout(timeout);
            clearTimeout(end);

            player.isLoading() && (this.id == 0) &&
            (this.howl["id"] = this.id =
                this.howl.play()) && player.toggleLoading();
        });
    }

    /**
     * Stops the track gracefully.
     */
    public stop() {
        this.howl.stop();
    }

    /**
     * Sets the playback time of the track.
     * @param time The time to set.
     * @return The current (or new) track time.
     */
    public seek(time: number | null): number {
        return time != null ? this.howl.seek(time) : this.howl.seek();
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
        // TODO: Implement fading the track.
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

export const player: MusicPlayer = new MusicPlayer();
player.setMaxListeners(100); // Increase the max event listeners.

type PlayAudioPayload = VolumePayload & {
    url: string;
    track_data: TrackData;
};

/**
 * Sets up event listeners.
 */
export async function setupListeners() {
    console.log("Setting up audio event listeners...");
}

/**
 * Identify the engine from a track ID.
 * @param id The track ID.
 */
function identifyEngineFromId(id: string): SearchEngine {
    if (id.length == 11) return "YouTube";
    if (id.length == 12) return "Spotify";

    return "All";
}

/**
 * Play an audio track from a search result.
 * @param track The search result of the track to play.
 */
export async function playFromResult(track: SearchResult): Promise<void> {
    const audioTrack: Track = await makeTrack(track); // Make a track from the search result.
    player.playTrack(audioTrack); // Play the track.
}

/**
 * Makes a track object from track data.
 * @param trackData The track data to make a track object from.
 */
export async function makeTrack(trackData: TrackData): Promise<Track> {
    return new Track({
        url: getPlaybackUrl(trackData.id),
        volume: 0.7,
        track_data: trackData
    });
}

/**
 * Creates a playback URL from a track ID.
 * @param id The ID of the track to create a playback URL for.
 */
function getPlaybackUrl(id: string): string {
    let engine = identifyEngineFromId(id);
    if (engine == "All") engine = "YouTube";

    return `${AccessDetails.route.formed}/download?id=${id}&engine=${engine}`;
}

/**
 * Syncs the player to a track.
 * @param data The gateway payload.
 */
export async function syncToTrack(data: SyncMessage) {
    // Validate the sync message.
    const track = data.track;
    if (!track) return;

    // Check if the track needs to be played.
    const playing = player.getCurrentTrack();
    if (!playing || track.id != playing.getData().id) {
        // Play the track.
        player.playTrack(await makeTrack(track));
    }

    // Set the player's progress.
    player.setProgress(data.progress);
}