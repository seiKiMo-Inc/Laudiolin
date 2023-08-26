import type { BaseGatewayMessage } from "@backend/gateway";

export type Page =
    | "Home"
    | "Recents"
    | "Search"
    | "Login"
    | "Playing"
    | "Playlist"
    | "Playlists"
    | "Favorites"
    | "Downloads"
    | "Queue"
    | "Settings";

export type SearchEngine = "YouTube" | "Spotify" | "All";
export type TrackData = {
    title: string;
    artist: string;
    icon: string;
    url: string;
    id: string;
    duration: number;
    serialized?: boolean;
};
export type SearchResults = {
    top: SearchResult;
    results: SearchResult[];
};

export type SearchResult = TrackData;
export type Playlist = {
    owner?: string;
    id?: string;

    name: string;
    description: string;
    icon: string;
    isPrivate: boolean;
    tracks: TrackData[];
};
export type PlaylistAuthor = {
    name: string;
    icon: string;
};

export type BasicUser = {
    username?: string;
    discriminator?: string;
    userId?: string;
    avatar?: string;
    connections?: {
        google: boolean;
        discord: boolean;
    };
};
export type OnlineUser = BasicUser & {
    listeningTo?: TrackData;
    progress?: number;
};
export type OfflineUser = BasicUser & {
    lastSeen: number;
    lastListeningTo: TrackData;
};
export type User = BasicUser & {
    playlists?: string[];
    likedSongs?: TrackData[];
    recentlyPlayed?: TrackData[];
};

export type Guild = {
    id: string;
    name: string;
    icon: string;
    bots: string[];
};
/**
 * If something is undefined, it should be ignored.
 * If something is null, the default value or a reset should be used.
 */
export type Synchronize = BaseGatewayMessage & {
    doAll: boolean | null | undefined;
    playingTrack: TrackData | null | undefined;
    paused: boolean | null | undefined;
    volume: number | null | undefined;
    queue: TrackData[] | null | undefined;
    loopMode: number | null | undefined;
    position: number | null | undefined;
    shuffle: boolean | null | undefined;
};

export type UserSettings = {
    search: SearchSettings;
    audio: AudioSettings;
    ui: UISettings;
    system: SystemSettings;
    token: string;
};
export type SearchSettings = {
    accuracy: boolean;
    engine: SearchEngine;
};
export type AudioSettings = {
    playback_mode: "Download" | "Stream";
    audio_quality: "Low" | "Medium" | "High";
    stream_sync: boolean;
};
export type UISettings = {
    color_theme: "Light" | "Dark";
};
export type SystemSettings = {
    offline: boolean;
    broadcast_listening: "Nobody" | "Friends" | "Everyone";
    presence: "Generic" | "Simple" | "None";
    close: "Exit" | "Tray";
};
export type SettingType = "boolean" | "input" | "select" | "color";

export type NotificationType = "info" | "progress";
export type InAppNotificationData = {
    type: NotificationType;
    message: string;
    date?: Date;
    icon?: string;

    event?: string;
    index?: number;
    totalProgress?: number;

    getProgress?: () => number;
    onPress?: (index: number) => void;
    update?: (data: InAppNotificationData) => void;
};

export type OfflineUserData = {
    user: User;
    playlists: string[];
    favorites: string[];
};
