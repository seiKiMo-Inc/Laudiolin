import type { TrackData } from "@backend/types";
import { EventEmitter } from "events";

import { Player as DefaultPlayer } from "@mod/player";

export type Loop = "none" | "track" | "queue";
export interface Track {
    data: TrackData;

    title: string;
    artist: string;
    icon: string;
    url: string;
    id: string;

    clone(): Track | any;
    duration(): number;
    progress(): number;
}

export type TrackHandler = (track: TrackData) => Promise<TrackData | undefined>;
export interface TrackPlayer extends EventEmitter {
    /* Player info. */
    paused: boolean;

    current: Track | null;
    queue: TrackData[];
    history: TrackData[];

    alternate: TrackHandler;

    getCurrentTrack(): Track | null;
    getProgress(): number;
    getDuration(): number;
    getQueue(): TrackData[];

    /* Player state. */
    reset(): void;
    getRepeatMode(): Loop;
    setRepeatMode(mode: Loop): void;

    /* Player manipulation. */
    shuffle(): void;
    add(track: TrackData): void;
    next(): void;
    back(): void;
    play(): Promise<void>;
    play(track: TrackData): Promise<void>;
    play(track: TrackData, force: boolean, history: boolean, play: boolean): Promise<void>;
    stop(emit: boolean): void;
    pause(): void;
    pause(set: boolean): void;
    seek(progress: number): void;
    volume(): number;
    volume(set: number): number;
}
