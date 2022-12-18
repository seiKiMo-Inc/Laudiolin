import React from "react";

import * as settings from "@backend/settings";
import { TrackData, Playlist } from "@backend/types";
import { fetchTrackById, parseArtist } from "@backend/search";
import { player, playFromResult } from "@backend/audio";
import { fetchAllPlaylists, addTrackToPlaylist } from "@backend/playlist";

import Router from "@components/common/Router";
import Button from "@components/common/Button";
import Modal, { displayModal } from "@components/common/Modal";
import Loader from "@components/common/Loader";
import { faAdd, faCopy, faPause, faPlay, faShare } from "@fortawesome/free-solid-svg-icons";

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

    addToPlaylist = async () => {
        this.hideModal();
        const playlistId = (document.getElementById("TrackModal-PlaylistSelect") as HTMLSelectElement).value;
        await addTrackToPlaylist(playlistId, this.state.track);
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

    async componentDidMount() {
        document.documentElement.scrollTop = 0;
        this.setState({
            track: await fetchTrackById(this.props.match.params.id,
                settings.search().engine)
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
        const track = this.state.track;

        if (track == null) {
            return <Loader />;
        }

        return (
            <div className="TrackContainer" key={track.id}>
                <div className="TrackBG" style={{ backgroundImage: `url(${track.icon})` }}></div>
                <img className="TrackImage" src={track.icon} alt="Track Icon" />
                <h2 className="TrackTitle">{track.title}</h2>
                <h3 className="TrackArtist">{parseArtist(track.artist)}</h3>
                <div className="TrackControls">
                    <Button className="TrackPlay" onClick={this.playTrack} icon={this.state.hasPlayed ? (this.state.playing ? faPause : faPlay) : faPlay} />
                    <h3 className="TrackDuration">{this.msToMinutes(track.duration)}</h3>
                </div>
                <div className="TrackButtons">
                    <Button className="TrackOptions" icon={faShare} onClick={this.openTrackSource}>Open Source</Button>
                    <Button icon={faAdd} className="TrackOptions" onClick={() => {
                        displayModal("TrackModal")
                        this.setState({ playlists: fetchAllPlaylists() });
                    }}>Add To Playlist</Button>
                    <Button icon={faCopy} className="TrackOptions" onClick={this.copyTrackURL}>Copy Track URL</Button>
                </div>
                <Modal id="TrackModal" onSubmit={this.addToPlaylist}>
                    <h2>Select Playlist</h2>
                    <select id="TrackModal-PlaylistSelect">
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