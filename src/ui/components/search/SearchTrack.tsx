import React from "react";
import { Link } from "react-router-dom";
import { Figure } from "react-bootstrap";
import Button from "@components/common/Button";

import { faPause, faPlay, faAdd, faShare, faCopy, faDownload } from "@fortawesome/free-solid-svg-icons";
import { player, playFromResult, fetchAllPlaylists } from "@backend/audio";

import type { Playlist, SearchResult } from "@backend/types";

import "@css/SearchTrack.scss";
import Modal, { displayModal } from "@components/common/Modal";

interface IProps {
    result: SearchResult;
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
        };
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

        window.onclick = (event) => {
            if (event.target == document.getElementById("TrackModal")) {
                this.hideModal();
            }
        };
    }

    componentWillUnmount() {
        // Un-listen for player events.
        player.removeListener("stop", this.updateState);
        player.removeListener("resume", this.updateState);
        player.removeListener("pause", this.updateState);

        window.onclick = null;
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

    preview2 = () => {
        alert("Download the song.");
    }

    hideModal = () => {
        const modal = document.getElementById("SearchModal");
        modal.style.display = "none";
    };

    // TODO: make adding to playlists work.
    addToPlaylist = async () => {
        this.hideModal();
        alert("This should add the track to the specified playlist.");
    };

    openTrackSource = () => {
        window.open(this.props.result.url, "_blank");
    };

    copyTrackURL = async () => {
        await navigator.clipboard.writeText(this.props.result.url);
    };


    render() {
        const result = this.props.result;
        console.log(result);

        return (
            <div className="SearchResult list-group-item dark:text-white dark:bg-slate-800" key={result.id}>
                <Figure id="figure">
                    <Figure.Caption id="statusButton">
                        <Button
                            id="statusButtonImage"
                            icon={this.state.hasPlayed ? (this.state.playing ? faPause : faPlay) : faPlay}
                            onClick={this.playTrack}
                        />
                    </Figure.Caption>

                    <Link to={`/track/${result.id}`}>
                        <Figure.Image src={result.icon} id="image" />
                    </Link>

                    <Figure.Caption className="TrackInfo result-title">
                        <Link to={`/track/${result.id}`}>
                            <span>{result.title}</span>
                        </Link>

                        <p className="text-gray-600">{result.artist}</p>

                        <Figure.Caption className="TrackOptions">
                            <Button icon={faAdd} className="TrackOptionsButtons" tooltip="Add to playlist" onClick={() => {
                                displayModal("TrackModal")
                                fetchAllPlaylists().then(playlists => {
                                    this.setState({ playlists: playlists });
                                })
                            }}/>
                            <Button icon={faShare} className="TrackOptionsButtons" tooltip="Open track source" onClick={this.openTrackSource} />
                            <Button icon={faCopy} className="TrackOptionsButtons" tooltip="Copy track URL" onClick={this.copyTrackURL} />
                            <Button icon={faDownload} className="TrackOptionsButtons" tooltip="Download track" onClick={this.preview2} />
                        </Figure.Caption>

                    </Figure.Caption>

                    <Modal id="SearchModal" onSubmit={this.addToPlaylist}>
                        <h2>Select Playlist</h2>
                        <select>
                            {this.state.playlists.map(playlist => {
                                return <option value={playlist.id}>{playlist.name}</option>
                            })}
                        </select>
                    </Modal>

                </Figure>
            </div>
        );
    }
}

export default SearchTrack;
