import React from "react";

import Track from "@components/Track";

import * as types from "@backend/types";

import "@css/pages/SearchResults.scss";

interface IProps {
    pageArgs: any;
}

class SearchResults extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    /**
     * Fetches an array of search results.
     * @param pageArgs The arguments passed to the page.
     */
    getResults(pageArgs: any): types.TrackData[] {
        // Check if the page arguments are valid.
        let results: types.SearchResults = null;
        if (pageArgs && pageArgs.results) {
            results = pageArgs.results;
        } else return null;

        // Sort the results.
        const sorted = [];
        sorted.push(results.top);
        results.results.forEach(result =>
            sorted.includes(results) ? null : sorted.push(result));

        return sorted;
    }

    render() {
        const { pageArgs } = this.props;
        const results = this.getResults(pageArgs);

        return (
            <div className={"SearchResults"}>
                {
                    results && results.map((result: types.TrackData, index: number) =>
                        <Track track={result} key={index} />)
                }
            </div>
        );
    }
}

export default SearchResults;
