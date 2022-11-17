import React from "react";

import { TrackData } from "@backend/types";
import { fetchTrack } from "@backend/audio";

import Router from "@components/common/Router";
import Button from "@components/common/Button";
import { faShare } from "@fortawesome/free-solid-svg-icons";

import "@css/TrackPage.scss";

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

    openTrackSource = () => {
        window.open(this.props.track.url, "_blank");
    };

    msToMinutes = (duration: number) => {
        if (duration <= 0) return "--:--";

        let minutes: number = Math.floor(duration / 60);
        let seconds: any = (duration % 60).toFixed(0);

        return seconds == 60 ? minutes + 1 + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    };

    componentDidMount() {
        fetchTrack(this.props.match.params.id).then((track) => {
            this.setState({
                track: track
            });
        });

        const root = document.getElementById("root");
        root.style.overflow = "hidden";
    }

    componentWillUnmount() {
        const root = document.getElementById("root");
        root.style.overflow = "auto";
    }

    render() {
        if (this.state.track === null) {
            return <h2 id="NoTrackMessage">No Track found.</h2>;
        }
        return (
            <div className="TrackContainer" key={this.state.track.id}>
                <div className="TrackBG" style={{ backgroundImage: `url(${this.state.track.icon})` }}></div>
                <img className="TrackImage" src={this.state.track.icon} alt="Track Icon" />
                <h2 className="TrackTitle">{this.state.track.title}</h2>
                <h3 className="TrackArtist">{this.state.track.artist}</h3>
                <h3 className="TrackDuration">{this.msToMinutes(this.state.track.duration)}</h3>
                <Button className="TrackRedirect" icon={faShare} onClick={this.openTrackSource}>Open Source</Button>
            </div>
        )
    }
}

export default Router(TrackPage);