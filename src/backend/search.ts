import type { SearchOptions } from "@backend/types";

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