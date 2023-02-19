import { TrackData } from "@backend/types";

export interface TrackPlayer {
    /* Player info. */
    getCurrentTrack(): Track | null;
    getProgress(): number;
    getDuration(): number;

    /* Player manipulation. */
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
