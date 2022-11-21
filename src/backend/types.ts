export type FilePayload = {
    file_path: string;
};
export type VolumePayload = {
    volume: number;
};
export type TrackPayload = {
    track: TrackData;
    progress?: number;
};

export type RichPresence = {
    details?: string;
    state?: string;
    start_timestamp?: number;
    end_timestamp?: number;
    large_image_key?: string;
    large_image_text?: string;
    small_image_key?: string;
    small_image_text?: string;
    party_id?: string;
    party_size?: number;
    party_max?: number;
    match_secret?: string;
    join_secret?: string;
    spectate_secret?: string;
    instance?: boolean;
};

export type SearchEngine = "YouTube" | "Spotify" | "All";
export type SearchResult = {
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

export type TrackData = SearchResult;
export type Playlist = {
    owner?: string;
    id?: string;

    name: string;
    description: string;
    icon: string;
    isPrivate: boolean;
    tracks: TrackData[];
};

export type User = {
    playlists?: string[];
    likedSongs?: string[];

    userId?: string;
    avatar?: string;
};

export type UserSettings = {
    search: SearchSettings;
    audio: AudioSettings;
    gateway: GatewaySettings;
    ui: UISettings;
    token: string;
};
export type SearchSettings = {
    accuracy: boolean;
    engine: SearchEngine;
};
export type AudioSettings = {
    download_path: string;
};
export type GatewaySettings = {
    encrypted: boolean;
    address: string;
    port: number;
    gateway_port: number;
};
export type UISettings = {
    background_color: string;
    background_url: string;
};
