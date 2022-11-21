import type { SearchOptions, SearchResults } from "@backend/types";

import { invoke } from "@tauri-apps/api";

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
    return await invoke("search", { query, engine: options.engine });
}

export function fetchTrackByUrl(url: string): Promise<SearchResults> {
    return
}
