import React from "react";
import { Container } from "react-bootstrap";
import SearchTrack from "@components/search/SearchTrack";

import { SearchResults } from "@backend/types";

interface IProps {
    results: SearchResults;
}

class SearchResultsElement extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <Container style={{ marginTop: "20px" }}>
                <div className="list-group">
                    {[this.props.results.top, ...this.props.results.results].map((result) => {
                        return (
                            <SearchTrack result={result} />
                        );
                    })}
                </div>
            </Container>
        );
    }
}

export default SearchResultsElement;