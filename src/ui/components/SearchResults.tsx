import { SearchResults } from "@backend/types";
import React from "react";
import { Col, Container, Figure, Row } from "react-bootstrap";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

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
                            <div className="SearchResults list-group-item dark:text-white dark:bg-slate-800" key={result.id}>
                                <Figure style={{ display: "inline-flex", verticalAlign: "bottom" }}>
                                    <Figure.Caption style={{ alignSelf: "center", marginRight: 20 }}>
                                        <Button
                                            icon={faPlay}
                                        />
                                    </Figure.Caption>
                                    <Figure.Image src={result.icon} style={{ maxWidth: 100 }} />
                                    <Figure.Caption className="result-title" style={{ alignSelf: "center", marginLeft: 20 }}>
                                        <a href={result.url}>
                                            <span>
                                                {result.title}
                                            </span>
                                        </a>
                                        <p className="text-gray-600">{result.artist}</p>
                                    </Figure.Caption>
                                </Figure>
                            </div>
                        );
                    })}
                </div>
            </Container>
        );
    }
}

export default SearchResultsElement;