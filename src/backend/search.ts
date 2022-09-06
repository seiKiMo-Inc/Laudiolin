import constants from "app/constants";

const blankResult: SearchResult = {
    artist: "", duration: 0, icon: "", title: "", url: ""
};
const noResults: SearchResults = {
    top: blankResult,
    results: [blankResult]
};

/**
 * Performs a search for the given query.
 * @param query The query to search for.
 * @param engine The search engine to use.
 * @return The results of the search.
 */
export async function searchFor(query: string, engine: string = "all"): Promise<SearchResults> {
    const response = await fetch(`${constants.APP_URL}/search/${query}?query=${engine}`);

    if(response.status == 404) {
        return noResults;
    } else return (await response.json()) as SearchResults;
}

export interface SearchResults {
    top: SearchResult;
    results: SearchResult[];
}
export interface SearchResult {
    title: string;
    artist: string;
    icon: string;
    url: string;
    id?: string;
    duration: number;
}