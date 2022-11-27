import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Playlist } from "@backend/types";
import { createPlaylist } from "@backend/user";

import { Card } from "react-bootstrap";
import Button from "@components/common/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal, { displayModal } from "@components/common/Modal";

import "@css/Playlist.scss"
import emitter from "@backend/events";

interface IProps {
    playlists: Playlist[];
}

interface IState {
    playlists: Playlist[];
}

class PlaylistsGrid extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    hideModal = () => {
        const modal = document.getElementById("createPlaylistModal");
        modal.style.display = "none";
    }

    makePlaylist = async () => {
        this.hideModal();
        const playlist: Playlist = {
            name: (document.getElementById("createPlaylistNameInput") as HTMLInputElement).value,
            description: (document.getElementById("createPlaylistDescriptionInput") as HTMLInputElement).value,
            icon: (document.getElementById("createPlaylistIconInput") as HTMLInputElement).value,
            isPrivate: (document.getElementById("createPlaylistPrivateInput") as HTMLInputElement).checked,
            tracks: []
        }
        await createPlaylist(playlist);

        emitter.emit("playlist-grid-update");
    }

    createPlaylistModal = (): ReactNode => {
        return (
            <Modal id="createPlaylistModal" onSubmit={this.makePlaylist}>
                <h2>Create A Playlist</h2>
                <input id="createPlaylistNameInput" type="text" placeholder="Playlist Name" />
                <textarea id="createPlaylistDescriptionInput" rows={5} placeholder="Playlist Description" />
                <input id="createPlaylistIconInput" type="text" placeholder="Playlist Icon URl" />
                <div className="playlistCheckBoxModal">
                    <p>Private Playlist?</p>
                    <input id="createPlaylistPrivateInput" type="checkbox" />
                </div>
            </Modal>
        )
    }

    render() {
        if (localStorage.getItem("isAuthenticated") !== "true") {
            return (
                <div id="NoPlaylistMessage">
                    You must be logged in to view or create playlists.
                </div>
            )
        }
        if (this.props.playlists.length == 0) {
            return (
                <div id="NoPlaylistMessage">
                    No playlists found.
                    <Button id="AddPlaylistButton" icon={faPlus} style={{ marginLeft: 10 }} onClick={() => displayModal("createPlaylistModal")} />
                    {this.createPlaylistModal()}
                </div>
            )
        }
        return (
            <>
                <span className="PlaylistsGrid">
                    {this.props.playlists.map((playlist) => {
                        return (
                            <Link to={`/playlist/${playlist.id}`} key={`${playlist.id}_${Math.random()}`}>
                                <Card className="PlaylistCards">
                                    <Card.Img variant="top" src={playlist.icon} />
                                    <Card.Body className="PlaylistCardText">
                                        <Card.Title>{playlist.name}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Link>
                        );
                    })}
                    <Button id="AddPlaylistButton" icon={faPlus} style={{ marginLeft: 10, height: '50px', width: '50px', alignSelf: 'center' }} onClick={() => displayModal("createPlaylistModal")} />
                </span>
                {this.createPlaylistModal()}
            </>
        );
    }
}

export default PlaylistsGrid;