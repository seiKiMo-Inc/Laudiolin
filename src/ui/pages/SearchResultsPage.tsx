import React from "react";
import { Navigate } from "react-router-dom";

import { Container } from "react-bootstrap";
import SearchResultsList from "@components/search/SearchResults";

import { Pages } from "@app/constants";
import { getQuery, doSearch } from "@backend/search";
import type { SearchResults } from "@backend/types";
import AnimatePages from "@components/common/AnimatePages";

import * as settings from "@backend/settings";

const blankResults: SearchResults = {
    top: {
        title: "",
        artist: "",
        icon: "",
        url: "",
        id: "",
        duration: 0
    },
    results: []
};

interface IProps {}
interface IState {
    skip: boolean;
    searchQuery: string;
    searchResults: SearchResults;
}

class SearchResultsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            skip: false,
            searchQuery: "",
            searchResults: blankResults
        };
    }

    reloadHook = () => {
        // Clear the search results.
        this.setState({
            skip: true,
            searchResults: blankResults
        });
        // Re-render the page.
        this.search();
    };

    search = () => {
        // Get the search query.
        const query = getQuery();
        // Check query validity.
        if (query == null || query == "") return;

        // Perform a search.
        doSearch(query, {
            engine: settings.search().engine,
            accuracy: true
        }).then((results) =>
            this.setState({ skip: false, searchResults: results }));
    };

    componentDidMount() {
        // Listen for reload.
        window.addEventListener("reload", this.reloadHook);
        // Perform search.
        this.search();
    }

    componentWillUnmount() {
        // Remove the reload listener.
        window.removeEventListener("reload", this.reloadHook);

        // Clear the data.
        this.setState({
            skip: false,
            searchQuery: "",
            searchResults: blankResults
        });
    }

    render() {
        const search = this.state.searchResults;
        const results = search.results;

        // Perform DOM reload check.
        if (!this.state.skip && results.length == 0 && getQuery(true) == "") {
            return <Navigate to={Pages.home} />;
        }

        return (
            <AnimatePages>
                <Container className="ContentContainer">
                    {search ? <SearchResultsList results={search} /> : <h1>Nothing found.</h1>}
                </Container>
            </AnimatePages>
        );
    }
}

export default SearchResultsPage;
