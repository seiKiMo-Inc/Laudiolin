import React from "react";

import Track from "@widget/Track";
import AnimatedView from "@components/common/AnimatedView";

import * as types from "@app/types";
import WithStore, { GlobalState, useGlobal } from "@backend/stores";

import "@css/pages/SearchResults.scss";

interface IProps {
    pStore: GlobalState;
}

class Search extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    /**
     * Fetches an array of search results.
     * @param pageArgs The arguments passed to the page.
     */
    getResults(pageArgs: types.SearchResults): types.TrackData[] {
        // Check if the page arguments are valid.
        let results: types.SearchResults = null;
        if (pageArgs && pageArgs.results) {
            results = pageArgs;
        } else return null;

        // Sort the results.
        const sorted = [];
        sorted.push(results.top);
        results.results.forEach((result) =>
            sorted.includes(results) ? null : sorted.push(result)
        );

        return sorted;
    }
    render() {
        const search = this.props.pStore.searchResults;
        const results = this.getResults(search);

        if (search?.waiting) {
            return (
                <AnimatedView className={"empty"}>
                    <h1>Searching...</h1>
                    <p>for '{this.props.pStore.searchQuery}'...</p>
                </AnimatedView>
            );
        }

        return results != null ? (
            <AnimatedView>
                <div className={"SearchResults"}>
                    {results &&
                        results.map((result: types.TrackData, index: number) => (
                            <Track track={result} key={index} />
                        ))}
                </div>
            </AnimatedView>
        ) : (
            <AnimatedView className={"empty"}>
                <h1>No results found.</h1>
            </AnimatedView>
        );
    }
}

export default WithStore(Search, useGlobal);
