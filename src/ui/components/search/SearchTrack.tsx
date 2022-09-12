import React from "react";
import type { SearchResult } from "@backend/types";

import "@css/SearchTrack.css";

interface IProps extends SearchResult {

}
interface IState {

}

/* A track that appears when searching for it. */
class SearchTrack extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div id="container">
                <svg id="image" src={this.props.icon} alt="Album art" />
                <div id="info">
                    <h3>{this.props.title}</h3>
                    <p>{this.props.artist}</p>
                </div>
            </div>
        );
    }
}

export default SearchTrack;