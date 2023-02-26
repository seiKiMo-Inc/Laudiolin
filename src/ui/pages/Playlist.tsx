import React, { useEffect } from "react";

import { IoMdPlay } from "react-icons/io";
import { MdShuffle } from "react-icons/md";
import { VscEllipsis } from "react-icons/vsc";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

import Track from "@widget/Track";
import BasicButton from "@components/common/BasicButton";
import BasicDropdown, { toggleDropdown } from "@components/common/BasicDropdown";
import BasicModal from "@components/common/BasicModal";
import BasicToggle from "@components/common/BasicToggle";
import AnimatedView from "@components/common/AnimatedView";

import * as types from "@backend/types";
import { playPlaylist } from "@backend/audio";
import { deletePlaylist, getPlaylistAuthor } from "@backend/user";
import { savePlaylist } from "@backend/offline";
import { editPlaylist } from "@backend/playlist";
import { loadPlaylists } from "@backend/user";
import { navigate } from "@backend/navigation";
import { notify } from "@backend/notifications";
import { reorder } from "@app/utils";

import "@css/pages/Playlist.scss";

interface IProps {
    pageArgs: any;
}

interface IState {
    playlist: types.Playlist;
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
            playlist: props.pageArgs,
            isPrivate: props.pageArgs.isPrivate,
            reloadKey: 0
        };
    }

    /**
     * Returns the tracks in the playlist.
     */
    getPlaylistTracks(): types.TrackData[] {
        const playlist = this.getPlaylist();
        if (!playlist) return [];

        return (
            playlist.tracks
                // Remove duplicate tracks.
                .filter((track, index, self) => {
                    return self.findIndex((t) => t.id == track.id) == index;
                })
        );
    }

    /**
     * Fetches the playlist from the page arguments.
     */
    getPlaylist(): types.Playlist {
        const args = this.state.playlist ??
            this.props.pageArgs;
        if (!args) return undefined;
        return args as types.Playlist;
    }

    /**
     * Plays the playlist.
     * @param shuffle Whether to shuffle the playlist.
     */
    play(shuffle = false): void {
        playPlaylist(this.getPlaylist(), shuffle);
    }

    /**
     * Downloads the playlist for offline use.
     */
    download(): void {
        const playlist = this.getPlaylist();

        // Save the playlist.
        playlist && savePlaylist(playlist);

        // Send a notification.
        notify({
            type: "info",
            message: `Started download of playlist ${
                playlist?.name ?? "Unknown"
            }.`
        });
    }

    /**
     * Deletes the playlist.
     */
    delete(): void {
        const playlist = this.getPlaylist();

        // Delete the playlist.
        playlist && deletePlaylist(playlist.id);
        // Navigate to the home page.
        navigate("Home");
    }

    /**
     * Handles a drag & drop event.
     * @param result The drag & drop result.
     */
    handleDrag(result: DropResult): void {
        // Check for a valid drag result.
        if (!result.destination) return;

        // Get the playlist.
        const playlist = this.getPlaylist();
        if (playlist == undefined) return;

        // Re-order the playlist tracks.
        const tracks = playlist.tracks;
        // Update the playlist.
        playlist.tracks = reorder(
            tracks,
            result.source.index,
            result.destination.index
        );
        this.setState({ playlist });
        editPlaylist(playlist);
    }

    /**
     * Edits the playlist info
     */
    editPlaylist = async (): Promise<void> => {
        const name = (document.getElementById("playlistNameInput") as HTMLInputElement).value;
        const description = (document.getElementById("playlistDescriptionInput") as HTMLInputElement).value;
        const icon = (document.getElementById("playlistIconURLInput") as HTMLInputElement).value;

        const playlist = this.getPlaylist();
        if (playlist == undefined) return;

        const oldName = playlist.name;

        playlist.name = name;
        playlist.description = description;
        playlist.icon = icon;
        playlist.isPrivate = this.state.isPrivate;

        this.setState({ playlist });
        await editPlaylist(playlist);

        if (oldName != name) await loadPlaylists();
    }

    componentDidMount() {
        console.log(this.state.playlist);
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (prevProps.pageArgs != this.props.pageArgs) {
            this.setState({
                playlist: this.props.pageArgs,
                isPrivate: this.props.pageArgs.isPrivate,
                reloadKey: this.state.reloadKey + 1
            });
        }
    }

    componentWillUnmount() {
        console.log("unmounting");
    }

    render() {
        const playlist = this.getPlaylist();
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
                                    <a onClick={() => this.download()}>Download Playlist</a>
                                    <a onClick={() => this.delete()}>Delete Playlist</a>
                                </BasicDropdown>

                                    <div className={"Playlist_Tracks"}>
                                        {this.getPlaylistTracks().map(
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

export default Playlist;
