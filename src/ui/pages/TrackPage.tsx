import React from "react";

import { TrackData, Playlist } from "@backend/types";
import { fetchAllPlaylists, fetchTrack, player, playFromResult } from "@backend/audio";

import Router from "@components/common/Router";
import Button from "@components/common/Button";
import Modal, { displayModal } from "@components/common/Modal";
import { faAdd, faCopy, faDownload, faPause, faPlay, faShare } from "@fortawesome/free-solid-svg-icons";

import "@css/TrackPage.scss";

interface IState {
    track: TrackData;
    playlists: Playlist[];
    playing: boolean;
    hasPlayed: boolean;
}

class TrackPage extends React.Component<any, IState> {
    constructor(props) {
        super(props);

        this.state = {
            track: null,
            playlists: [],
            playing: false,
            hasPlayed: false
        }
    }

    playTrack = () => {
        const hasPlayed = this.state.hasPlayed;
        const isPlaying = this.state.playing;

        if (hasPlayed) {
            player.togglePlayback(); // Pause/resume the player.
            this.setState({ playing: !isPlaying });
        } else {
            // Check if the player is currently playing.
            if (player.isPlaying()) player.stopTrack();
            this.setState({ hasPlayed: true });

            playFromResult(this.state.track).then(() => {
                // Change the state to playing.
                this.setState({ playing: !isPlaying });
            });
        }
    };

    updateState = () => {
        if (!this.state.hasPlayed) return;
        this.setState({
            playing: !this.state.playing,
            hasPlayed: !this.state.hasPlayed
        });
    };

    preview2 = () => {
        alert("Download the song.");
    }

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

    msToMinutes = (duration: number) => {
        if (duration <= 0) return "--:--";

        let minutes: number = Math.floor(duration / 60);
        let seconds: any = (duration % 60).toFixed(0);

        return seconds == 60 ? minutes + 1 + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    };

    hideModal = () => {
        const modal = document.getElementById("TrackModal");
        modal.style.display = "none";
    };

    componentDidMount() {
        fetchTrack(this.props.match.params.id).then((track) => {
            this.setState({
                track: track
            });
        });

        const root = document.getElementsByTagName("body")[0];
        root.style.overflow = "hidden";

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
        const root = document.getElementsByTagName("body")[0];
        root.style.overflow = "auto";

        // Un-listen for player events.
        player.removeListener("stop", this.updateState);
        player.removeListener("resume", this.updateState);
        player.removeListener("pause", this.updateState);

        window.onclick = null;
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
                <div className="TrackControls">
                    <Button className="TrackPlay" onClick={this.playTrack} icon={this.state.hasPlayed ? (this.state.playing ? faPause : faPlay) : faPlay} />
                    <h3 className="TrackDuration">{this.msToMinutes(this.state.track.duration)}</h3>
                </div>
                <div className="TrackButtons">
                    <Button className="TrackOptions" icon={faShare} onClick={this.openTrackSource}>Open Source</Button>
                    <Button icon={faAdd} className="TrackOptions" onClick={() => {
                        displayModal("TrackModal")
                        fetchAllPlaylists().then(playlists => {
                            this.setState({ playlists: playlists });
                        })
                    }}>Add To Playlist</Button>
                    <Button icon={faCopy} className="TrackOptions" onClick={this.copyTrackURL}>Copy Track URL</Button>
                    <Button icon={faDownload} className="TrackOptions" onClick={this.preview2}>Download Track</Button>
                </div>
                <Modal id="TrackModal" onSubmit={this.addToPlaylist}>
                    <h2>Select Playlist</h2>
                    <select>
                        {this.state.playlists.map(playlist => {
                            return <option value={playlist.id}>{playlist.name}</option>
                        })}
                    </select>
                </Modal>
            </div>
        )
    }
}

export default Router(TrackPage);