import React from "react";

import { Playlist } from "@backend/types";
import { player } from "@backend/audio";
import { fetchPlaylist, renamePlaylist, describePlaylist, setPlaylistIcon, setPlaylistVisibility } from "@backend/playlist";
import Router from "@components/common/Router";

import AnimatePages from "@components/common/AnimatePages";
import PlaylistTracks from "@components/playlist/PlaylistTracks";

import { faCog, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import Button from "@components/common/Button";
import Modal, { displayModal } from "@components/common/Modal";

import "@css/Playlist.scss";
import { loadPlaylists } from "@backend/user";
import emitter from "@backend/events";

interface IState {
    playlist: Playlist;
    banner: string;
    hasPlayed: boolean;
    playing: boolean;
}

class PlaylistPage extends React.Component<any, IState> {
    constructor(props) {
        super(props);

        this.state = {
            playlist: null,
            banner: "",
            hasPlayed: false,
            playing: false
        };
    }

    displaySettingsButton = () => {
        const button = document.getElementById("PlaylistSettingsButton");
        button.style.display = "block";
    };

    hideSettingsButton = () => {
        const button = document.getElementById("PlaylistSettingsButton");
        button.style.display = "none";
    };

    editPlaylist = async () => {
        const name = (document.getElementById("PlaylistNameInput") as HTMLInputElement).value;
        const description = (document.getElementById("PlaylistDescriptionInput") as HTMLInputElement).value;
        const icon = (document.getElementById("PlaylistIconURLInput") as HTMLInputElement).value;
        const isPrivate = (document.getElementById("PlaylistPrivateInput") as HTMLInputElement).checked;
        const banner = (document.getElementById("PlaylistBannerURLInput") as HTMLInputElement).value;

        if (name !== this.state.playlist.name) {
            await renamePlaylist(this.state.playlist.id, name);
            console.log("Renamed playlist to " + name);
        }
        if (description !== this.state.playlist.description) {
            await describePlaylist(this.state.playlist.id, description);
            console.log("Changed playlist description to " + description);
        }
        if (icon !== this.state.playlist.icon) {
            await setPlaylistIcon(this.state.playlist.id, icon);
            console.log("Changed playlist icon to " + icon);
        }
        if (isPrivate !== this.state.playlist.isPrivate) {
            await setPlaylistVisibility(this.state.playlist.id, isPrivate);
            console.log("Changed playlist visibility to " + isPrivate);
        }

        localStorage.setItem(`playlist-${this.state.playlist.id}-banner`, banner);

        this.setState({
            banner: banner,
            playlist: {
                name: name,
                description: description,
                icon: icon,
                isPrivate: isPrivate,
                tracks: this.state.playlist.tracks,
            }
        });

        this.hideModal();
    };

    hideModal = () => {
        const modal = document.getElementById("PlaylistSettingsModal");
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

    playPlaylist = async () => {
        await player.queuePlaylist(this.state.playlist, true);
    };

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
                        onMouseOver={this.displaySettingsButton}
                        onMouseLeave={this.hideSettingsButton}
                    >
                        <div
                            className="PlaylistHeaderBG"
                            style={{ backgroundImage: `url(${this.state.banner || this.state.playlist.icon})` }}
                        ></div>
                        <img src={this.state.playlist.icon} className="PlaylistIcon" alt={this.state.playlist.name} />
                        <Button className="TrackPlay" id="PlaylistPlay" onClick={this.playPlaylist} icon={this.state.hasPlayed ? (this.state.playing ? faPause : faPlay) : faPlay} />
                        <div className="PlaylistHeaderInfo">
                            <h2>{this.state.playlist.name}</h2>
                            <p>{this.state.playlist.description}</p>
                        </div>
                        <Button id="PlaylistSettingsButton" icon={faCog} onClick={() => displayModal("PlaylistSettingsModal")} />
                    </div>
                    <div className="PlaylistContent">
                        {this.state.playlist.tracks.length > 0 ? (
                            <PlaylistTracks playlist={this.state.playlist} />
                        ) : (
                            <h2 id="NoTracksMessage">No tracks found.</h2>
                        )}
                    </div>
                </div>
                <Modal id="PlaylistSettingsModal" onSubmit={this.editPlaylist}>
                    <h2>Edit Playlist</h2>
                    <p>Name</p>
                    <input type="text" id="PlaylistNameInput" defaultValue={this.state.playlist.name} />
                    <p>Description</p>
                    <textarea id="PlaylistDescriptionInput" defaultValue={this.state.playlist.description} />
                    <p>Icon image URL</p>
                    <input type="text" id="PlaylistIconURLInput" defaultValue={this.state.playlist.icon} />
                    <div className="playlistCheckBoxModal">
                        <p>Private Playlist?</p>
                        <input id="PlaylistPrivateInput" type="checkbox" />
                    </div>
                    <p>Banner image URL</p>
                    <input type="text" id="PlaylistBannerURLInput" placeholder="Banner Url" />
                </Modal>
            </AnimatePages>
        );
    }
}

export default Router(PlaylistPage);
