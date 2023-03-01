import React from "react";

import Track from "@widget/Track";
import AnimatedView from "@components/common/AnimatedView";

import * as types from "@backend/types";
import emitter from "@backend/events";

import "@css/pages/SearchResults.scss";

interface IState {
    results: types.TrackData[];
}

class Search extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            results: null
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
            const sorted = this.getResults(results);
            this.setState({ results: sorted });
        });
    }

    render() {
        const { results } = this.state;

        return (
            <AnimatedView>
                <div className={"SearchResults"}>
                    {results &&
                        results.map((result: types.TrackData, index: number) => (
                            <Track track={result} key={index} />
                        ))}
                </div>
            </AnimatedView>
        );
    }
}

export default Search;
