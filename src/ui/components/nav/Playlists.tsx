import React from "react";

import { BiAddToQueue } from "react-icons/bi";

import NavLink from "@components/NavLink";
import BasicModal from "@components/common/BasicModal";
import BasicToggle from "@components/common/BasicToggle";
import BasicButton from "@components/common/BasicButton";
import Alert from "@components/Alert";

import { Playlist } from "@backend/types";
import emitter from "@backend/events";
import { createPlaylist, loadPlaylists, login } from "@backend/user";
import { importPlaylist } from "@backend/playlist";

import "@css/layout/NavPanel.scss";

interface IState {
    playlists: Playlist[];
    createPrivatePlaylist: boolean;
}

class Playlists extends React.Component<any, IState> {
    /**
     * Playlist update callback.
     * @param playlists The new playlists.
     */
    update = (playlists: Playlist[]) => this.setState({ playlists });

    /**
     * Clears all playlists.
     */
    clear = () => this.setState({ playlists: [] });

    constructor(props: {}) {
        super(props);

        this.state = {
            playlists: [],
            createPrivatePlaylist: false
        };
    }

    openImportModal = () => {
        BasicModal.showModal("playlistImportModal");
        BasicModal.hideModal("playlistCreateModal");
    }

    /**
     * Creates a new playlist.
     */
    createNewPlaylist = async (): Promise<void> => {
        const name = (document.getElementById("playlistCreateModal_name") as HTMLInputElement).value || "New Playlist";
        const description = (document.getElementById("playlistCreateModal_description") as HTMLInputElement).value || "No description";
        const icon = (document.getElementById("playlistCreateModal_icon") as HTMLInputElement).value || "https://i.pinimg.com/564x/e2/26/98/e22698a130ad38d08d3b3d650c2cb4b3.jpg";
        const privatePlaylist = this.state.createPrivatePlaylist;

        const playlist: Playlist = {
            name,
            description,
            icon,
            isPrivate: privatePlaylist,
            tracks: []
        }

        Alert.showAlert("Creating playlist...");

        await createPlaylist(playlist);
        await login();
        await loadPlaylists();
    }

    /**
     * Imports a playlist.
     */
    importPlaylist = async (): Promise<void> => {
        const url = (document.getElementById("playlistImportModal_url") as HTMLInputElement).value;

        Alert.showAlert("Importing playlist...");

        await importPlaylist(url);
        await login();
        await loadPlaylists();
    }

    componentDidMount() {
        emitter.on("playlist", this.update);
        emitter.on("logout", this.clear);
    }

    componentWillUnmount() {
        emitter.off("playlist", this.update);
        emitter.off("logout", this.clear);
    }

    render() {
        const { playlists } = this.state;

        return playlists.length > 0 ? (
            <>
                <div className={"Playlists_Divider"} />
                <div className={"Playlists_Header"}>
                    <h3>Your Playlists</h3>
                    <BiAddToQueue onClick={() => BasicModal.showModal("playlistCreateModal")} />
                </div>

                <div className={"Playlists_Container"}>
                    {playlists.map((playlist) => (
                        <NavLink
                            to={"Playlist"}
                            with={playlist}
                            className={"Playlists_Item"}
                            key={playlist.id}
                        >
                            {({ isActive }) => (
                                <p
                                    style={{
                                        color:
                                            isActive &&
                                            "var(--text-primary-color)"
                                    }}
                                >
                                    {playlist.name}
                                </p>
                            )}
                        </NavLink>
                    ))}
                </div>

                <BasicModal id={"playlistCreateModal"} onSubmit={this.createNewPlaylist}>
                    <h1>Create a new playlist</h1>
                    <input type={"text"} id={"playlistCreateModal_name"} placeholder={"Playlist name"} />
                    <textarea id={"playlistCreateModal_description"} placeholder={"Playlist description"} />
                    <input type={"text"} id={"playlistCreateModal_icon"} placeholder={"Direct URL for the playlist icon"} />
                    <div className="PlaylistCheckBoxModal">
                        <p>Private Playlist?</p>
                        <BasicToggle default={false} update={() => this.setState({ createPrivatePlaylist: !this.state.createPrivatePlaylist })} />
                    </div>
                    <div className={"OR_Divider"}>
                        <div className={"OR_Divider_Line"} />
                        <p>OR</p>
                        <div className={"OR_Divider_Line"} />
                    </div>
                    <BasicButton className={"PlaylistImportButton"} onClick={this.openImportModal} text={"Import Playlist"} />
                </BasicModal>

                <BasicModal id={"playlistImportModal"} onSubmit={this.importPlaylist}>
                    <h1>Import a playlist</h1>
                    <p style={{ color: "var(--text-secondary-color)" }}>You can import any playlist from YouTube or Spotify.</p>
                    <input type={"text"} id={"playlistImportModal_url"} placeholder={"Playlist URL"} />
                </BasicModal>
            </>
        ) : null;
    }
}

export default Playlists;
