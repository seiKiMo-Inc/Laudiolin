import type { SearchOptions, SearchResult } from "@backend/types";
import SearchTrack from "@components/search/SearchTrack";

import { invoke } from "@tauri-apps/api";

/**
 * Performs a search from the query.
 * Creates a collection of SearchTracks.
 * @param query The query to search for.
 * @param options The options to use for the search.
 */
export async function doSearch(query: string, options: SearchOptions) {
    // Perform search.
    const results = await invoke("search", {
        query, engine: options.engine
    });

    console.log(results);
}

/**
 * Converts a SearchResult to a SearchTrack.
 * @param result The SearchResult to convert.
 */
export function fromResult(result: SearchResult): SearchTrack {
    return new SearchTrack({
        title: result.title,
        artist: result.artist,
        icon: result.icon,
        url: result.url,
        id: result.id,
        duration: result.duration,
    });
}