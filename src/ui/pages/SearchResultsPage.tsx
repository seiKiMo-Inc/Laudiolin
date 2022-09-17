import React from "react";
import { Link } from "react-router-dom";

import { Container } from "react-bootstrap";
import SearchResultsList from "@components/search/SearchResults";

import { Pages } from "@app/constants";
import { getQuery, doSearch } from "@backend/search";
import type { SearchResults } from "@backend/types";

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

interface IProps {

}
interface IState {
    searchQuery: string;
    searchResults: SearchResults;
}

class SearchResultsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            searchQuery: "",
            searchResults: blankResults
        };
    }

    componentDidMount() {
        // Get the search query.
        const query = getQuery();
        // Check query validity.
        if(query == null || query == "")
            return;

        // Perform a search.
        doSearch(query, {
            engine: "YouTube", accuracy: true
        }).then(results => this.setState({ searchResults: results }));
    }

    componentWillUnmount() {
        // Clear the data.
        this.setState({
            searchQuery: "",
            searchResults: blankResults
        });
    }

    render() {
        return (
            <Container className="ContentContainer">
                {
                    this.state.searchResults ?
                        <SearchResultsList results={this.state.searchResults} /> :
                        <h1>Nothing found.</h1>
                }
            </Container>
        );
    }
}

export default SearchResultsPage;