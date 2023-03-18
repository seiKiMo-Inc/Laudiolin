import React from "react";

import Track from "@widget/Track";
import AnimatedView from "@components/common/AnimatedView";

import * as types from "@backend/types";
import emitter from "@backend/events";
import { save, get } from "@backend/settings";

import "@css/pages/SearchResults.scss";

interface IState {
    results: types.TrackData[];
}

class Search extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            results: JSON.parse(get("searchResults")) || null
        }
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

    componentDidMount() {
        emitter.on("search", (results: types.SearchResults) => {
            if (results.results.length < 1) return this.setState({ results: null });
            const sorted = this.getResults(results);
            this.setState({ results: sorted });
        });
    }

    componentWillUnmount() {
        save("searchResults", JSON.stringify(this.state.results));
        emitter.off("search", () => this.setState({ results: null }) );
    }

    render() {
        const { results } = this.state;

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

export default Search;
