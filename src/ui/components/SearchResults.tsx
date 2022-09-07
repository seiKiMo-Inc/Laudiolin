import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { SearchResults } from "backend/search";

const SearchResultsElement = (props: { results: SearchResults }) => {
    return (
        <Container style={{ marginTop: "20px" }}>
            <div className="list-group">
                {[props.results.top, ...props.results.results].map((result) => {
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
};

export default SearchResultsElement;
