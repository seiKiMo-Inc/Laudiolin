import React, { useEffect } from "react";

import { BiCopy } from "react-icons/bi";
import { IoMdPlay } from "react-icons/io";
import { MdShuffle } from "react-icons/md";
import { VscEllipsis } from "react-icons/vsc";

import Track from "@widget/Track";
import Alert from "@components/Alert";

import BasicButton from "@components/common/BasicButton";
import BasicDropdown, { toggleDropdown } from "@components/common/BasicDropdown";
import BasicModal from "@components/common/BasicModal";
import BasicToggle from "@components/common/BasicToggle";
import AnimatedView from "@components/common/AnimatedView";
import Router from "@components/common/Router";

import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

import * as types from "@app/types";
import { playPlaylist } from "@backend/core/audio";
import { deletePlaylist, getPlaylistAuthor } from "@backend/social/user";
import { savePlaylist } from "@backend/desktop/offline";
import { editPlaylist, fetchPlaylist } from "@backend/core/playlist";
import { loadPlaylists } from "@backend/social/user";
import { notify } from "@backend/features/notifications";
import { reorder } from "@app/utils";
import { router } from "@app/main";
import { contentRoutes } from "@app/constants";

import WithStore, { GlobalState, useGlobal, usePlaylists } from "@backend/stores";

import "@css/pages/Playlist.scss";

interface IProps {
    pStore: GlobalState;
    match: any;
}

interface IState {
    isPrivate: boolean;
    reloadKey: number;
}

function PlaylistAuthor(props: { playlist: types.Playlist }) {
    const playlist = props.playlist;
    const [author, setAuthor] = React.useState<types.PlaylistAuthor>(null);

    useEffect(() => {
        (async () => {
            setAuthor(await getPlaylistAuthor(playlist));
        })();
    }, []);

    return playlist ? (
        <div className={"Playlist_Author"}>
            <img
                className={"profile"}
                alt={playlist.owner}
                src={author?.icon ?? ""}
            />

            <p className={"username"}>{author?.name ?? ""}</p>
        </div>
    ) : undefined;
}

class Playlist extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            isPrivate: false,
            reloadKey: 0
        };
    }

    /**
     * Fetches the playlist from the page arguments.
     */
    async getPlaylist(): Promise<types.Playlist> {
        const args = this.props.pStore.playlist ??
            (await fetchPlaylist(this.props.match.params.id));
        if (!args) return undefined;
        return args as types.Playlist;
    }

    /**
     * Plays the playlist.
     * @param shuffle Whether to shuffle the playlist.
     */
    async play(shuffle = false): Promise<void> {
        await playPlaylist(await this.getPlaylist(), shuffle);
    }

    /**
     * Downloads the playlist for offline use.
     */
    async download(): Promise<void> {
        const playlist = await this.getPlaylist();

        // Save the playlist.
        playlist && await savePlaylist(playlist);

        // Send a notification.
        notify({
            type: "info",
            message: `Started download of playlist ${
                playlist?.name ?? "Unknown"
            }.`
        }).catch(err => console.warn(err));
    }

    /**
     * Deletes the playlist.
     */
    async delete(): Promise<void> {
        const playlist = await this.getPlaylist();

        // Delete the playlist.
        playlist && await deletePlaylist(playlist.id);
        // Navigate to the home page.
        await router.navigate(contentRoutes.HOME);
        // Remove the playlist from the list.
        const newPlaylists = usePlaylists.getState()
            .filter((p) => p.id != playlist.id);
        usePlaylists.setState(newPlaylists);
    }

    /**
     * Copies the URL of the playlist to the URL.
     */
    async share(): Promise<void> {
        await navigator.clipboard.writeText(
            `https://laudiolin.seikimo.moe/playlist/${this.props.pStore.playlist.id}`);
        Alert.showAlert("Playlist URL copied to clipboard!", <BiCopy />);
    }

    /**
     * Handles a drag & drop event.
     * @param result The drag & drop result.
     */
    async handleDrag(result: DropResult): Promise<void> {
        // Check for a valid drag result.
        if (!result.destination) return;

        // Get the playlist.
        const playlist = await this.getPlaylist();
        if (playlist == undefined) return;

        // Re-order the playlist tracks.
        const tracks = playlist.tracks;
        // Update the playlist.
        playlist.tracks = reorder(
            tracks,
            result.source.index,
            result.destination.index
        );
        this.props.pStore.setPlaylist(playlist);
        editPlaylist(playlist)
            .catch(err => console.warn(err));
    }

    /**
     * Edits the playlist info
     */
    editPlaylist = async (): Promise<void> => {
        const name = (document.getElementById("playlistNameInput") as HTMLInputElement).value;
        const description = (document.getElementById("playlistDescriptionInput") as HTMLInputElement).value;
        const icon = (document.getElementById("playlistIconURLInput") as HTMLInputElement).value;

        const playlist = await this.getPlaylist();
        if (playlist == undefined) return;

        const oldName = playlist.name;

        playlist.name = name;
        playlist.description = description;
        playlist.icon = icon;
        playlist.isPrivate = this.state.isPrivate;

        this.props.pStore.setPlaylist(playlist);
        await editPlaylist(playlist);

        if (oldName != name) await loadPlaylists();
    }

    async componentDidMount() {
        const playlist = await this.getPlaylist();
        if (!playlist) {
            await router.navigate(contentRoutes.HOME);
            return;
        }

        this.setState({ isPrivate: playlist.isPrivate });
    }

    async componentDidUpdate(prevProps: IProps) {
        if (prevProps.match.params.id != this.props.match.params.id ||
            this.props.pStore.playlist?.id != this.props.match.params.id) {
            const playlist = await fetchPlaylist(this.props.match.params.id);
            this.props.pStore.setPlaylist(playlist);

            this.setState({ isPrivate: playlist.isPrivate, reloadKey: this.state.reloadKey + 1 });
        }
    }

    render() {
        const playlist = this.props.pStore.playlist;
        if (!playlist) return undefined;

        return (
            <AnimatedView key={this.state.reloadKey.toString()}>
                <DragDropContext onDragEnd={result => this.handleDrag(result)}>
                    <Droppable droppableId={"trackList"}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <div className={"Playlist"}>
                                    <div className={"Playlist_Details"}>
                                        <img
                                            className={"icon"}
                                            alt={playlist.name}
                                            src={playlist.icon}
                                        />

                                        <div className={"info"}>
                                            <p
                                                style={{
                                                    textTransform: "uppercase",
                                                    paddingTop: 28
                                                }}
                                            >
                                                {playlist.isPrivate
                                                    ? "Private Playlist"
                                                    : "Public Playlist"}
                                            </p>

                                            <h1 className={"info_title"}>
                                                {playlist.name}
                                            </h1>
                                            <p className={"info_description"}>
                                                {playlist.description}
                                            </p>

                                            <PlaylistAuthor playlist={playlist} />

                                            <div className={"Playlist_Actions"}>
                                                <BasicButton
                                                    className={"action"}
                                                    icon={<IoMdPlay />}
                                                    onClick={() => this.play()}
                                                />

                                                <BasicButton
                                                    className={"action"}
                                                    icon={<MdShuffle />}
                                                    onClick={() => this.play(true)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"Playlist_Interact"}>
                                        <BasicButton
                                            className={"edit"}
                                            text={"Edit Playlist"}
                                            onClick={() => BasicModal.showModal("playlistModal")}
                                        />

                                        <div className={"buttons"}>
                                            <BasicButton
                                                className={"dropbtn"}
                                                icon={<VscEllipsis />}
                                                onClick={() =>
                                                    toggleDropdown(
                                                        "Playlist_Actions"
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                <BasicDropdown id={"Playlist_Actions"}>
// #v-ifdef VITE_BUILD_ENV='desktop'
                                    <a onClick={() => this.download()}>Download Playlist</a>
// #v-endif
                                    <a onClick={() => this.delete()}>Delete Playlist</a>
                                    <a onClick={() => this.share()}>Copy Playlist URL</a>
                                </BasicDropdown>

                                    <div className={"Playlist_Tracks"}>
                                        {playlist.tracks.map(
                                            (track, index) => (
                                                <Draggable
                                                    key={track.id}
                                                    draggableId={track.id + index}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Track
                                                                track={track}
                                                                playlist={
                                                                    playlist.id
                                                                }
                                                                key={index}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        )}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <BasicModal id={"playlistModal"} onSubmit={this.editPlaylist}>
                    <h1>Edit Playlist</h1>
                    <p>Name</p>
                    <input type="text" id="playlistNameInput" defaultValue={playlist.name} />
                    <p>Description</p>
                    <textarea id="playlistDescriptionInput" defaultValue={playlist.description} />
                    <p>Icon image URL</p>
                    <input type="text" id="playlistIconURLInput" defaultValue={playlist.icon} />
                    <div className="PlaylistCheckBoxModal">
                        <p>Private Playlist?</p>
                        <BasicToggle default={this.state.isPrivate} update={() => this.setState({ isPrivate: !this.state.isPrivate })} />
                    </div>
                </BasicModal>
            </AnimatedView>
        );
    }
}

export default WithStore(Router(Playlist), useGlobal);
