export type FilePayload = {
    file_path: string;
}

export type SearchResult = {
    title: string;
    artist: string;
    icon: string;
    url: string;
    id?: string;
    duration: number;
}
export type SearchResults = {
    top: SearchResult;
    results: SearchResult[];
}
export type SearchOptions = {
    engine: string;
    accuracy: boolean;
}