import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api";
import { Howl, Howler } from "howler";
import { EventEmitter } from "events";

import { file } from "@backend/fs";

import type { Event } from "@tauri-apps/api/event";
import type { SearchResult, TrackData, FilePayload, VolumePayload, TrackPayload, Playlist } from "@backend/types";

/**
 * TODO: Move music player to the backend. (Rust)
 *
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

    private originalVolume: number = -1;
    private isPaused: boolean = true;
    private isShuffled: boolean = false;
    private isLooped: number = 0; // 0 = no loop, 1 = loop track, 2 = loop queue

    constructor() {
        super();

        this.updateTask = setInterval(() => {
            // Emit update event.
            this.emitUpdate();
            // Check for track end.
            this.currentTrack?.checkEnd();
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
        return this.getCurrentTrack().seek();
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

        // Extract the playable tracks.
        const tracks = [];
        for (const track of playlist.tracks) {
            tracks.push(await makeTrack(track));
        }

        // Play the first track if specified.
        if (autoPlay) {
            this.playTrack(tracks.shift()!);
        }

        // Add the tracks to the queue.
        this.trackQueue.push(...tracks);
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
        if (!stopCurrent && this.currentTrack.isPlaying()) {
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
        // Check if there is a track playing.
        // TODO: Check if #getProgress is in milliseconds.
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
     * Toggles the player's mute state.
     */
    togglePlayback() {
        if (!this.currentTrack) return;

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
        const isStreamed = payload.file_path.includes("http");
        const filePath = isStreamed ? payload.file_path : file(payload);

        this.howl = new Howl({
            html5: isStreamed,
            format: "mp3",
            src: [filePath],
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
     * Checks if the track has ended.
     * Tracks can stop very close to the end of the duration.
     */
    public checkEnd(): void {
        if (this.howl.duration() - this.howl.seek() < 1.4) {
            this.stop();
        }
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
        this.howl.once("load", () => {
            this.id = this.howl.play();
        });
    }

    /**
     * Stops the track gracefully.
     */
    public stop() {
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
// DEBUGGING SYMBOL:
window["player"] = player;

type PlayAudioPayload = FilePayload &
    VolumePayload & {
        track_data: TrackData;
    };
type PlayPlaylistPayload = {
    playlist: Playlist;
};
type TrackSyncPayload = TrackPayload;

/**
 * Sets up event listeners.
 */
export async function setupListeners() {
    console.log("Setting up audio event listeners...");
    await listen("play_audio", playAudio);
    await listen("set_volume", updateVolume);
    await listen("track_sync", syncToTrack);
    await listen("play_playlist", playPlaylist);
}

/**
 * Play an audio track from a search result.
 * @param track The search result of the track to play.
 */
export async function playFromResult(track: SearchResult): Promise<void> {
    // Download the audio file.
    // TODO: Check settings for the user's preferred search engine.
    await invoke("play_from", { track });
}

/**
 * Makes a track object from track data.
 * @param trackData The track data to make a track object from.
 */
export async function makeTrack(trackData: TrackData): Promise<Track> {
    // Get the play audio payload.
    const payload = await invoke("make_track", { track: trackData });
    // Make a new track object.
    return new Track(payload as PlayAudioPayload);
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
 * Plays a playlist.
 * @param event The event.
 */
async function playPlaylist(event: Event<any>) {
    // Get the playlist.
    const playlist = event.payload.playlist;
    // Play the playlist.
    await player.queuePlaylist(playlist, true);
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

/**
 * Syncs the player to a track.
 * @param event The event.
 */
async function syncToTrack(event: Event<any>) {
    // Parse the payload from the event.
    const payload: TrackSyncPayload = event.payload;

    // Check if the track needs to be played.
    const track = payload.track;
    const playing = player.getCurrentTrack();
    if (!playing || track.id != playing.getData().id) {
        // Play the track.
        await invoke("play_from", { track });
    }

    // Set the player's progress.
    player.setProgress(payload.progress);
}

/*
 * EVERTHING BELOW THIS COMMENT IS A PLACEHOLDER FOR NOW.
 */

const playlists: Playlist[] = [
    {
        id: "1",
        name: "Test Playlist",
        description: "A test playlist.",
        icon: "https://i.scdn.co/image/ab67706c0000bebb7e710c74f1e638f148bf3164",
        tracks: [
            {
                icon: "https://i.scdn.co/image/ab67616d00001e02d3b27ed188ff76904ef0c300",
                artist: "Given",
                title: "冬のはなし",
                duration: 100,
                id: "YwxyAO7xsJs",
                url: "https://www.youtube.com/watch?v=YwxyAO7xsJs"
            },
            {
                icon: "https://i.scdn.co/image/ab67616d0000b2733e2780c2283bbcb8f5d740d0",
                artist: "RADWIMPS, Toko Miura",
                title: "Grand Escape (Movie Edit) [feat. Toko Miura]",
                duration: 100,
                id: "WwyDpKXG83A",
                url: "https://www.youtube.com/watch?v=WwyDpKXG83A"
            }
        ]
    },
    {
        id: "2",
        name: "Test Playlist With bigger title aaaaaaaaaaaaaaaaaaaaaaa a",
        description: "A test playlist.",
        icon: "https://i.scdn.co/image/ab67616d00001e021d24f8fa55739bdf2fecfd24",
        tracks: [
            {
                icon: "https://i.imgur.com/0Z0Z0Z0.png",
                artist: "Test Artist",
                title: "Test Title",
                duration: 100,
                id: "1",
                url: "https://i.imgur.com/0Z0Z0Z0.png"
            },
            {
                icon: "https://i.imgur.com/0Z0Z0Z0.png",
                artist: "Test Artist",
                title: "Test Title",
                duration: 100,
                id: "2",
                url: "https://i.imgur.com/0Z0Z0Z0.png"
            }
        ]
    }
];

// TODO: fetch all playlists
export async function fetchAllPlaylists(): Promise<Playlist[]> {
    return playlists
}

// TODO: fetch playlist by id
export async function fetchPlaylist(id: string): Promise<Playlist> {
    return playlists.find(p => p.id == id)
}

// TODO: fetch track by id
export async function fetchTrack(id: string): Promise<TrackData> {
    return playlists[0].tracks.find(t => t.id == id)
}