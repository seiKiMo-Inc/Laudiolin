import type { SearchResult, SearchResults, TrackData } from "@backend/types";

import { Gateway } from "@app/constants";
import * as settings from "@backend/settings";

const blank: SearchResult = {
    title: "",
    artist: "",
    icon: "",
    url: "",
    id: "",
    duration: -1
};

/**
 * Performs a search for the given query.
 * @param query The search query.
 */
export async function doSearch(query: string): Promise<SearchResults> {
    const engine = settings.search().engine;

    try {
        // Perform a request to the backend.
        const response = await fetch(
            `${Gateway.getUrl()}/search/${query}?query=${engine}`
        );
        // Return the response as a search results object.
        return (await response.json()) as SearchResults;
    } catch (error) {
        return {
            results: [],
            top: blank
        };
    }
}

/**
 * Fetches track data from a song URL.
 * @param id The URL of the song.
 */
export async function fetchTrackById(id: string): Promise<TrackData> {
    const response = await fetch(`${Gateway.getUrl()}/fetch/${id}`);
    return (await response.json()) as TrackData;
}

/**
 * Parses a track's artist into a visually appealing string.
 * @param artist The artist to parse.
 */
export function parseArtist(artist: string): string {
    if (artist.trim().length == 0) return "Unknown Artist";
    if (artist.includes("- Topic")) artist = artist.replace("- Topic", "");

    return artist; // Return the artist after parsing.
}
