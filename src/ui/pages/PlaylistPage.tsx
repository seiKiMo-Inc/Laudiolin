import React from "react";

import { Playlist } from "@backend/types";
import { fetchPlaylist } from "@backend/playlist";
import Router from "@components/common/Router";

import AnimatePages from "@components/common/AnimatePages";
import PlaylistTracks from "@components/playlist/PlaylistTracks";

import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Button from "@components/common/Button";
import Modal, { displayModal } from "@components/common/Modal";

import "@css/Playlist.scss";
import { loadPlaylists } from "@backend/user";
import emitter from "@backend/events";

interface IState {
    playlist: Playlist;
    banner: string;
}

class PlaylistPage extends React.Component<any, IState> {
    constructor(props) {
        super(props);

        this.state = {
            playlist: null,
            banner: ""
        };
    }

    displayUploadButton = () => {
        const button = document.getElementById("BannerUpload");
        button.style.display = "block";
    };

    hideUploadButton = () => {
        const button = document.getElementById("BannerUpload");
        button.style.display = "none";
    };

    setBanner = async () => {
        const url = document.getElementById("BannerURL") as HTMLInputElement;
        await localStorage.setItem(`playlist-${this.state.playlist.id}-banner`, url.value);
        this.setState({ banner: url.value });
        this.hideModal();
    };

    hideModal = () => {
        const modal = document.getElementById("PlaylistModal");
        modal.style.display = "none";
    };

    async componentDidMount() {
        await loadPlaylists();
        this.setState({
            playlist: fetchPlaylist(this.props.match.params.id),
            banner: localStorage.getItem(`playlist-${fetchPlaylist(this.props.match.params.id).id}-banner` || null)
        });

        window.onclick = (event) => {
            if (event.target == document.getElementById("PlaylistModal")) {
                this.hideModal();
            }
        };

        emitter.on("playlist-update", async () => {
            await loadPlaylists();
            this.setState({
                playlist: fetchPlaylist(this.props.match.params.id),
            });
        });
    }


    componentWillUnmount() {
        window.onclick = null;
    }

    render() {
        if (this.state.playlist == null) {
            return <h2 id="NoPlaylistMessage">No playlists found.</h2>;
        }
        return (
            <AnimatePages>
                <div className="PlaylistContainer">
                    <div
                        className="PlaylistHeader"
                        onMouseOver={this.displayUploadButton}
                        onMouseLeave={this.hideUploadButton}
                    >
                        <div
                            className="PlaylistHeaderBG"
                            style={{ backgroundImage: `url(${this.state.banner || this.state.playlist.icon})` }}
                        ></div>
                        <img src={this.state.playlist.icon} className="PlaylistIcon" alt={this.state.playlist.name} />
                        <div className="PlaylistHeaderInfo">
                            <h2>{this.state.playlist.name}</h2>
                            <p>{this.state.playlist.description}</p>
                        </div>
                        <Button id="BannerUpload" icon={faUpload} onClick={() => displayModal("PlaylistModal")} />
                        <Modal id="PlaylistModal" onSubmit={this.setBanner}>
                            <h2>Upload a banner</h2>
                            <input type="text" id="BannerURL" placeholder="Image URL" />
                        </Modal>
                    </div>
                    <div className="PlaylistContent">
                        {this.state.playlist.tracks.length > 0 ? (
                            <PlaylistTracks tracks={this.state.playlist.tracks} playlistId={this.state.playlist.id} />
                        ) : (
                            <h2 id="NoTracksMessage">No tracks found.</h2>
                        )}
                    </div>
                </div>
            </AnimatePages>
        );
    }
}

export default Router(PlaylistPage);
