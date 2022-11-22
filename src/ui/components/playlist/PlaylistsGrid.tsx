import React, { JSXElementConstructor, ReactNode } from "react";
import { Link } from "react-router-dom";

import { Playlist } from "@backend/types";
import { fetchAllPlaylists } from "@backend/playlist";
import { createPlaylist } from "@backend/user";

import { Card } from "react-bootstrap";
import Button from "@components/common/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal, { displayModal } from "@components/common/Modal";

import "@css/Playlist.scss"

interface IState {
    playlists: Playlist[];
}

class PlaylistsGrid extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            playlists: []
        }
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
        this.setState({
            playlists: [...this.state.playlists, playlist]
        });
        console.log(playlist)
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

    componentDidMount() {
        this.setState({ playlists: fetchAllPlaylists() });
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<IState>, snapshot?: any) {
        if (prevState.playlists.length != this.state.playlists.length) {
            this.setState({ playlists: fetchAllPlaylists() });
        }
    }

    render() {
        if (this.state.playlists.length == 0) {
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
                    {this.state.playlists.map((playlist) => {
                        return (
                            <Link to={`/playlist/${playlist.id}`} key={playlist.id}>
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