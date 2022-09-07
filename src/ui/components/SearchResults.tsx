import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { SearchResults } from "backend/search";

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
                            <div className="list-group-item dark:text-white dark:bg-slate-800" key={result.id}>
                                <Row>
                                    <Col>
                                        <Image src={result.icon} />
                                        <a href={result.url}>{result.title}</a>
                                        <div className="text-gray-600">{result.artist}</div>
                                    </Col>
                                </Row>
                            </div>
                        );
                    })}
                </div>
            </Container>
        );
    }
}

export default SearchResultsElement;
