import { TrackData } from "@backend/types";

export type Loop = "none" | "track" | "queue";
export interface TrackPlayer {
    /* Player info. */
    getCurrentTrack(): Track | null;
    getProgress(): number;
    getDuration(): number;
    getQueue(): TrackData[];

    /* Player state. */
    setRepeatMode(mode: Loop): void;

    /* Player manipulation. */
    shuffle(): void;
    add(track: TrackData): void;
    next(): void;
    back(): void;
    play(track: TrackData, force: boolean): Promise<void>;
    stop(emit: boolean): void;
    pause(): void;
}

export interface Track {
    title: string;
    artist: string;
    icon: string;
    url: string;
    id: string;

    clone(): Track;
    duration(): number;
    progress(): number;
}
