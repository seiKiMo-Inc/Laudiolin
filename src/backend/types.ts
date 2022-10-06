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
    startTimestamp?: number;
    endTimestamp?: number;
    largeImageKey?: string;
    largeImageText?: string;
    smallImageKey?: string;
    smallImageText?: string;
    partyId?: string;
    partySize?: number;
    partyMax?: number;
    matchSecret?: string;
    joinSecret?: string;
    spectateSecret?: string;
};

export type SearchEngine = "YouTube" | "Spotify" | "all";
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
    id: string;
    name: string;
    description: string;
    icon: string;
    tracks: TrackData[];
};

export type UserSettings = {
    search: SearchSettings;
    audio: AudioSettings;
    gateway: GatewaySettings;
    ui: UISettings;
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
