import { SearchResults } from "backend/search";
import React from "react";
import { Col, Container, Figure, Row } from "react-bootstrap";

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
                                        <Figure>
                                            <Figure.Image src={result.icon} />
                                            <Figure.Caption>
                                                <a href={result.url}>{result.title}</a>
                                                <p className="text-gray-600">{result.artist}</p>
                                            </Figure.Caption>
                                        </Figure>
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
