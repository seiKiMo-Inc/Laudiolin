export type Page =
    "Home" | "Recents" | "Search" |
    "Login" | "Playing" | "Playlist" |
    "Playlists" | "Profile" | "Favorites" |
    "Downloads" | "Settings";

export type SearchEngine = "YouTube" | "Spotify" | "All";
export type TrackData = {
    title: string;
    artist: string;
    icon: string;
    url: string;
    id: string;
    duration: number;
};
export type SearchResults = {
    top: SearchResult;
    results: SearchResult[];
};
export type SearchOptions = {
    engine: string;
    accuracy: boolean;
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

};
export type UISettings = {
    background_color: string;
    background_url: string;
    progress_fill: "Solid" | "Gradient";
};
export type SystemSettings = {
    offline: boolean;
    broadcast_listening: "Nobody" | "Friends" | "Everyone";
    presence: "Generic" | "Simple" | "None";
};
export type SettingType = "boolean" | "input" | "select" | "color";

export type NotificationType = "info" | "progress";
export type InAppNotificationData = {
    type: NotificationType;
    message: string;
    date: Date;
    icon: string;

    event?: string;
    index?: number;
    totalProgress?: number;

    getProgress?: () => number;
    onPress?: (index: number) => void;
    update?: (data: InAppNotificationData) => void;
};

export type PlaylistSelectInfo = {
    title: string;
    callback: (playlist?: Playlist) => void;
};

export type OfflineUserData = {
    user: User;
    playlists: string[];
    favorites: string[];
};
