import React from "react";

import { TrackData } from "@backend/types";
import { fetchTrack } from "@backend/audio";

import Router from "@components/common/Router";

interface IState {
    track: TrackData
}

class TrackPage extends React.Component<any, IState> {
    constructor(props) {
        super(props);

        this.state = {
            track: null
        }
    }

    componentDidMount() {
        fetchTrack(this.props.match.params.id).then((track) => {
            this.setState({
                track: track
            });
        });
    }

    render() {
        if (this.state.track === null) {
            return <h2 id="NoTrackMessage">No Track found.</h2>;
        }
        return (
            <div key={this.state.track.id}>
                <img src={this.state.track.icon} alt="Track Icon" />
                <h2>{this.state.track.title}</h2>
                <p>{this.state.track.artist}</p>
                <p>{this.state.track.url}</p>
                <p>{this.state.track.duration}</p>
            </div>
        )
    }
}

export default Router(TrackPage);