import React from "react";
import { Container } from "react-bootstrap";
import SearchTrack from "@components/search/SearchTrack";

import { SearchResults } from "@backend/types";

interface IProps {
    results: SearchResults;
}

class SearchResultsList extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const results = this.props.results.results;

        return (
            <Container style={{ marginTop: "20px" }}>
                <div className="list-group">
                    {
                        results.length == 0 ? (
                            <h3>There are no search results.</h3>
                        ) : results.map(result => {
                            return (
                                <SearchTrack key={result.id} result={result} />
                            );
                        })
                    }
                </div>
            </Container>
        );
    }
}

export default SearchResultsList;