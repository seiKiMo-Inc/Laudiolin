import React from "react";
import {SearchResult} from "backend/search";

import "css/SearchTrack.css";

interface IProps {
    track: SearchResult;
}

interface IState {

}

/* A track that appears when searching for it. */
class SearchTrack extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const track = this.props.track;

        if(track) {
            return (
                <div id="searchTrack">
                    <img src={track.icon} alt={track.title}/>
                </div>
            );
        }

        return (
            <div>
                <a>There is no track!</a>
            </div>
        )
    }
}

export default SearchTrack;