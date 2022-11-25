import { AccessDetails } from "@app/constants";
import type { SearchEngine, SearchOptions, SearchResults, TrackData } from "@backend/types";

let nextQuery: string = "";

/**
 * Sets the next search query.
 * @param query The search query.
 */
export function setQuery(query: string): void {
    nextQuery = query;
}

/**
 * Returns the next search query.
 */
export function getQuery(check: boolean = false): string {
    // Cache the next query.
    const query = nextQuery;
    // Clear the query and return the cache.
    !check && (nextQuery = "");
    return query;
}

/**
 * Performs a search from the query.
 * Creates a collection of SearchTracks.
 * @param query The query to search for.
 * @param options The options to use for the search.
 */
export async function doSearch(query: string, options: SearchOptions): Promise<SearchResults> {
    const response = await fetch(`${AccessDetails.route.formed}/search/${query}?query=${options.engine}`);
    return (await response.json()) as SearchResults;
}

/**
 * Fetches track data from a song URL.
 * @param url The URL of the song.
 * @param engine The search engine to use.
 */
export async function fetchTrackByUrl(url: string, engine: SearchEngine = "YouTube"): Promise<TrackData> {
    const response = await fetch(`${AccessDetails.route.formed}/fetch/${url}?query=${engine}`);
    return (await response.json()) as TrackData;
}

/**
 * Parses a track's artist into a visually appealing string.
 * @param artist The artist to parse.
 */
export function parseArtist(artist: string): string {
    if (artist.trim().length == 0) return "";
    if (artist.includes("- Topic")) artist = artist.replace("- Topic", "");

    return artist; // Return the artist after parsing.
}