import React from "react";
import { Link } from "react-router-dom";

import { downloadTrack, player, playFromResult } from "@backend/audio";
import type { Playlist, SearchResult } from "@backend/types";

import { Figure } from "react-bootstrap";
import Button from "@components/common/Button";
import { faPause, faPlay, faAdd, faShare, faCopy, faDownload } from "@fortawesome/free-solid-svg-icons";
import { displayModal } from "@components/common/Modal";

import "@css/SearchTrack.scss";

interface IProps {
    result: SearchResult;
    onClick: () => void;
}

interface IState {
    playing: boolean;
    hasPlayed: boolean;
    playlists: Playlist[];
}

/* A track that appears when searching for it. */
class SearchTrack extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            playing: false,
            hasPlayed: false,
            playlists: []
        }
    }

    updateState = () => {
        if (!this.state.hasPlayed) return;
        this.setState({
            playing: !this.state.playing,
            hasPlayed: !this.state.hasPlayed
        });
    };

    componentDidMount() {
        // Listen for player events.
        player.on("stop", this.updateState);
        player.on("resume", this.updateState);
        player.on("pause", this.updateState);
    }

    componentWillUnmount() {
        // Un-listen for player events.
        player.removeListener("stop", this.updateState);
        player.removeListener("resume", this.updateState);
        player.removeListener("pause", this.updateState);
    }

    playTrack = () => {
        const hasPlayed = this.state.hasPlayed;
        const isPlaying = this.state.playing;

        if (hasPlayed) {
            player.togglePlayback(); // Pause/resume the player.
            this.setState({ playing: !isPlaying });
        } else {
            // Check if the player is currently playing.
            this.setState({ hasPlayed: true });

            // Play the track from the specified result.
            playFromResult(this.props.result).then(() => {
                // Change the state to playing.
                this.setState({ playing: !isPlaying });
            });
        }
    };

    download = () => {
        downloadTrack(this.props.result.id)
            .then(() => alert("Track was downloaded successfully!"))
            .catch(() => alert("An error occurred while downloading the track."));
    };

    openTrackSource = () => {
        window.open(this.props.result.url, "_blank");
    };

    copyTrackURL = async () => {
        await navigator.clipboard.writeText(this.props.result.url);
    };

    render() {
        const result = this.props.result;

        return (
            <div className="SearchResult list-group-item dark:text-white dark:bg-slate-800" key={result.id} onClick={this.props.onClick}>
                <Figure id="figure">
                    <Figure.Caption id="statusButton">
                        <Button
                            id="statusButtonImage"
                            icon={this.state.hasPlayed ? (this.state.playing ? faPause : faPlay) : faPlay}
                            onClick={this.playTrack}
                        />
                    </Figure.Caption>

                    <Link to={`/track/${result.id}`}>
                        <Figure.Image src={result.icon} id="SearchResultImage" />
                    </Link>

                    <Figure.Caption className="SearchTrackInfo result-title">
                        <Link to={`/track/${result.id}`}>
                            <span>{result.title}</span>
                        </Link>

                        <p className="text-gray-600">{result.artist}</p>

                        <Figure.Caption className="SearchTrackOptions">
                            <Button icon={faAdd} className="SearchTrackOptionsButtons" tooltip="Add to playlist" onClick={() => displayModal("SearchModal")} />
                            <Button icon={faShare} className="SearchTrackOptionsButtons" tooltip="Open track source" onClick={this.openTrackSource} />
                            <Button icon={faCopy} className="SearchTrackOptionsButtons" tooltip="Copy track URL" onClick={this.copyTrackURL} />
                            <Button icon={faDownload} className="SearchTrackOptionsButtons" tooltip="Download track" onClick={this.download} />
                        </Figure.Caption>
                    </Figure.Caption>
                </Figure>
            </div>
        );
    }
}

export default SearchTrack;
