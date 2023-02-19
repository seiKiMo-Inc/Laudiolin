import type { TrackData } from "@backend/types";
import * as mod from "@backend/modules";

import { Howl } from "howler";
import { EventEmitter } from "events";

export type Loop = "none" | "track" | "queue";
export type PlayerState = {
    paused: boolean;
    loop: Loop;
};

export class Player extends EventEmitter implements mod.TrackPlayer {
    private readonly updateTask: NodeJS.Timer|number;
    public alternate: (track: TrackData) => Promise<TrackData | undefined>;

    /* Queue */
    private current: Track | null = null;
    private readonly queue: TrackData[] = [];
    private readonly history: TrackData[] = [];

    /* State */
    public state: PlayerState = {
        paused: false,
        loop: "none"
    };

    constructor() {
        super();

        this.updateTask = setInterval(() => {
            this.update(); // Update listeners.
        }, 500);
    }

    /**
     * Emits the update event.
     */
    public update(): void {
        this.emit("update", {
            ...this.state,
            progress: this.getProgress()
        });
    }

    /**
     * Gets the currently playing track.
     */
    public getCurrentTrack(): Track | null {
        return this.current;
    }

    /**
     * Returns the current progress into the track.
     */
    public getProgress(): number {
        return this.current ? this.current.progress() : 0;
    }

    /**
     * Returns the duration of the track.
     */
    public getDuration(): number {
        return this.current ? this.current.duration() : 0;
    }

    /**
     * Adds a track to the queue.
     * @param track The track to add.
     */
    public add(track: TrackData): void {
        this.queue.push(track);
    }

    /**
     * Continues to the next queued track.
     */
    public next(): void {
        const current = this.current;

        // Check if something is playing.
        current && this.stop();

        // Check if there is a next track.
        if (this.queue.length > 0) {
            const { loop } = this.state;

            // Play the next track.
            if (loop != "track") {
                this.play(this.queue.shift()!);
                if (current && loop == "queue")
                    this.queue.push(current.data);
            } else {
                this.play(current.data);
            }
        } else {
            this.stop(); // Stop the player.
        }
    }

    /**
     * Plays the previous track.
     */
    public back(): void {
        // Check if there is a previous track.
        if (this.history.length > 0) {
            // Play the previous track.
            this.play(this.history.pop()!, true, false);
        } else {
            this.stop(); // Stop the player.
        }
    }

    /**
     * Plays the specified track.
     * @param track The track to play.
     * @param force Should the track be played even if it is already playing?
     * @param history Should the track be added to the history?
     */
    public async play(
        track?: TrackData,
        force = true,
        history = true,
    ): Promise<void> {
        // Check if a track was specified.
        if (!track) {
            // Resume the player or queue the next track.
            if (this.queue.length < 1) return;

            // Play the next track.
            return this.play(this.queue.shift()!, force, history);
        }

        // Check if something is playing.
        if (this.current && !force) {
            // Add the track to the queue.
            this.queue.push(track); return;
        }

        // Check if a track is already playing.
        let current; if ((current = this.current)) {
            // Check if the track is the same.
            if (history && current.id != track.id)
                // Add the current track to the history.
                this.history.push(current.data);
            // Stop the current track.
            this.stop(false);
        }

        // Create a new track.
        this.current = new Track(track,
            await this.alternate?.(track));
        this.current.play();

        // Set the player state.
        this.state.paused = false;

        // Emit the play event.
        this.emit("play", this.current);
    }

    /**
     * Stops the playback of the player.
     */
    public stop(emit = true): void {
        // Emit the stop event.
        emit && this.emit("stop");
        // Signal to tracks to stop.
        this.emit("destroy");
    }

    /**
     * Toggles the pause state of the player.
     */
    public pause(): void {
        this.state.paused = !this.state.paused;
        this.update();
    }
}

export class Track extends Howl implements mod.Track {
    constructor(
        public readonly data: TrackData, // This is the original track data.
        public readonly playData?: TrackData // This is the track data that should be used for playback.
    ) {
        super({
            format: "mp3",
            html5: !playData,
            src: [playData ? playData.url : data.url],
            volume: 0.5
        });

        this.on("end", () => {
            TrackPlayer.pause(); // Pause the player.
            TrackPlayer.emit("end", this); // Emit the end event.
            TrackPlayer.next(); // Play the next track.
        });

        TrackPlayer.on("destroy", () => {
            this.stop(); // Stop the track.
            this.unload(); // Unload the track.
            TrackPlayer.removeAllListeners("destroy"); // Remove the listener.
        });
    }

    get title(): string {
        return this.data.title;
    }

    get artist(): string {
        return this.data.artist;
    }

    get icon(): string {
        return this.data.icon;
    }

    get url(): string {
        return this.data.url;
    }

    get id(): string {
        return this.data.id;
    }

    /**
     * Creates a shallow clone of this track.
     */
    public clone(): Track {
        return new Track(this.data, this.playData);
    }

    /**
     * Returns the progress of the track in seconds.
     */
    public progress(): number {
        return this.seek();
    }
}

const TrackPlayer = new Player();
export default TrackPlayer;
