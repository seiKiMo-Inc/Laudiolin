import React from "react";
import { Container } from "react-bootstrap";

import SearchTrack from "@components/search/SearchTrack";
import Loader from "@components/common/Loader";

import type { SearchResults } from "@backend/types";

interface IProps {
    results: SearchResults;
}

class SearchResultsList extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    componentDidUpdate() {
        // Scroll to the top of the page when the results change.
        document.documentElement.scrollTop = 0;
    }

    render() {
        const results = this.props.results.results;

        // Remove duplicate values.
        const uniqueResults = results.filter((result, index, self) => {
            return self.findIndex(r => r.id === result.id) === index;
        });

        return (
            <Container style={{ marginTop: "20px" }}>
                <div className="list-group">
                    {results.length == 0 ? (
                        <Loader />
                    ) : (
                        uniqueResults.map((result) => {
                            return <SearchTrack key={result.id} result={result} />;
                        })
                    )}
                </div>
            </Container>
        );
    }
}

export default SearchResultsList;
