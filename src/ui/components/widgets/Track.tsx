import React, { MouseEvent } from "react";
import { open } from "@tauri-apps/api/shell";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { VscEllipsis } from "react-icons/vsc";
import { BiCopy } from "react-icons/bi";

import Alert from "@components/Alert";

import BasicDropdown, {
    toggleDropdown
} from "@components/common/BasicDropdown";
import BasicButton from "@components/common/BasicButton";

import type { TrackData } from "@backend/types";
import { deleteTrack, deQueue, downloadTrack, playTrack } from "@backend/audio";
import { addTrackToPlaylist, fetchAllPlaylists, fetchPlaylist, removeTrackFromPlaylist } from "@backend/playlist";
import { formatDuration, getIconUrl, isFavorite } from "@app/utils";
import { isDownloaded } from "@backend/offline";
import { favoriteTrack } from "@backend/user";
import { parseArtist } from "@backend/search";
import emitter from "@backend/events";

import "@css/components/Track.scss";
import BasicModal from "@components/common/BasicModal";

interface IProps {
    track: TrackData;
    playlist?: string;
    queue?: boolean;
}

interface IState {
    selectedId: string | null;
    selectedName: string | null;
    inPlaylist: string | null;
}

class Track extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            selectedId: null,
            selectedName: null,
            inPlaylist: props.playlist
        };
    }

    /**
     * Plays this track.
     */
    play(): void {
        const track = this.props.track;
        track && playTrack(track, true, true);
    }

    /**
     * Adds this track to the queue.
     */
    queue(remove = false): void {
        const track = this.props.track;
        if (track == undefined) return;

        if (remove) {
            deQueue(track);
        } else {
            playTrack(track, false, false);
        }
    }

    /**
     * Adds the current track to the favorites.
     */
    async favorite(): Promise<void> {
        const track = this.props.track;
        if (!track) return;

        // Toggle the favorite state.
        await favoriteTrack(track, !isFavorite(track));
        this.forceUpdate();
    }

    /**
     * Sets the position of a dropdown.
     */
    setDropdownPosition(e: MouseEvent, id: string): void {
        const dropdown = document.getElementById(id);
        const trackWidth = document.getElementsByClassName("Track")[0]?.clientWidth;
        const container = document.getElementsByClassName("Playlist")[0] as HTMLElement ??
            document.getElementsByClassName("Home")[0] as HTMLElement ??
            dropdown?.parentElement;

        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const scrollOffset = container.scrollTop;

        if (dropdown && trackWidth) {
            dropdown.style.left = `${trackWidth - 250}px`;
        }

        dropdown.style.top = `${e.clientY - containerRect.top + scrollOffset}px`;
    }

    /**
     * Opens the track source in a browser.
     */
    async openSource(): Promise<void> {
        const track = this.props.track;
        if (!track) return;

        await open(track.url);
    }

    /**
     * Copies the track URL to the clipboard.
     */
    async copyUrl(): Promise<void> {
        const track = this.props.track;
        if (!track) return;

        await navigator.clipboard.writeText(track.url);
        Alert.showAlert("Copied URL to clipboard.", <BiCopy />);
    }

    /**
     * Adds this track to a playlist.
     */
    async addToPlaylist(): Promise<void> {
        // Open the playlist modal.
        if (this.state.selectedId == null) {
            this.setState({ selectedId: "" });
            BasicModal.showModal("add_playlist");
        } else {
            // Add the track to the playlist.
            const playlist = await fetchPlaylist(this.state.selectedId);
            if (!playlist) {
                this.setState({ selectedId: null, selectedName: null });
                return;
            }

            playlist.tracks.push(this.props.track);
            await addTrackToPlaylist(this.state.selectedId, this.props.track);
            Alert.showAlert("Added track to playlist.");

            this.setState({
                selectedId: null, selectedName: null,
                inPlaylist: this.state.selectedId
            });

            // Reload the playlist.
            emitter.emit("playlist:reload", playlist);
        }
    }

    /**
     * Removes this track from its playlist.
     */
    async removeFromPlaylist(): Promise<void> {
        const playlistId = this.state.inPlaylist ?? this.props.playlist;
        if (!playlistId) return;

        // Fetch the playlist's contents.
        const playlist = await fetchPlaylist(playlistId);
        if (!playlist) return;

        // Get the index of this track from the playlist.
        const index = playlist.tracks.findIndex(t => t.id === this.props.track.id);
        if (index == -1) return;

        // Remove the track from the playlist.
        playlist.tracks.splice(index, 1);
        await removeTrackFromPlaylist(playlistId, index);
        Alert.showAlert("Removed track from playlist.");

        // Reload the playlist.
        emitter.emit("playlist:reload", playlist);
    }

    render() {
        const { track } = this.props;
        if (track == undefined) return null;

        const favorite = isFavorite(track);

        return (
            <>
                <div
                    className={"Track"}
                    onClick={() => this.play()}
                >
                    <div className={"Track_Info"}>
                        <img
                            className={"Track_Icon"}
                            alt={track.title}
                            src={getIconUrl(track)}
                        />

                        <div className={"Track_Text"}>
                            <p>{track.title}</p>
                            <p>{parseArtist(track.artist)}</p>
                        </div>
                    </div>

                    <div className={"Track_Interact"}>
                        <p>{formatDuration(track.duration)}</p>
                        {favorite ? (
                            <AiFillHeart
                                style={{
                                    width: 20,
                                    height: 18.18,
                                    color: "var(--accent-color)"
                                }}
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    await this.favorite();
                                }}
                            />
                        ) : (
                            <AiOutlineHeart
                                style={{ width: 20, height: 18.18 }}
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    await this.favorite();
                                }}
                            />
                        )}
                        <BasicButton
                            id={`Track_${track.id}_Button`}
                            icon={<VscEllipsis />}
                            onClick={(e) => {
                                e.stopPropagation();
                                this.setDropdownPosition(e, `Track_${track.id}`);
                                toggleDropdown(`Track_${track.id}`);
                            }}
                            className={"dropbtn"}
                            style={{ backgroundColor: "transparent" }}
                        />
                    </div>
                </div>

                <BasicDropdown id={`Track_${track.id}`} className={`Track_${track.id}`}>
                    {!this.props.queue ? (
                        <a onClick={() => this.queue()}>Add to Queue</a>
                    ) : (
                        <a onClick={() => this.queue(true)}>
                            Remove from Queue
                        </a>
                    )}
                    {isDownloaded(track) ? (
                        <a onClick={() => deleteTrack(track)}>Delete Track</a>
                    ) : (
                        <a onClick={() => downloadTrack(track)}>
                            Download Track
                        </a>
                    )}

                    {(this.props.playlist || this.state.inPlaylist) ? (
                        <a onClick={() => this.removeFromPlaylist()}>Remove Track from Playlist</a>
                    ) : (
                        <a onClick={() => this.addToPlaylist()}>Add Track to Playlist</a>
                    )}
                    <a onClick={async () => await this.openSource()}>
                        Open Track Source
                    </a>
                    <a onClick={async () => await this.copyUrl()}>
                        Copy Track URL
                    </a>
                </BasicDropdown>

                <BasicModal
                    id={"add_playlist"}
                    buttonText={"Add to Playlist"}
                    onSubmit={() => this.addToPlaylist()}
                    style={{ alignItems: "center" }}
                >
                    <h1>Select a Playlist</h1>
                    <BasicButton
                        id={`AddTrack_${track.id}_Button dropbtn`}
                        className={`Track_Button`}
                        text={this.state.selectedName ?? "Select a Playlist"}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(`AddTrack_${track.id}`);
                        }}
                    />

                    <BasicDropdown
                        id={`AddTrack_${track.id}`}
                        className={`Track_${track.id}`}
                    >
                        {
                            fetchAllPlaylists().map((playlist, index) => {
                                return (
                                    <a
                                        key={index}
                                        onClick={() => this.setState({
                                            selectedId: playlist.id,
                                            selectedName: playlist.name
                                        })}
                                    >{playlist.name}</a>
                                );
                            })
                        }
                    </BasicDropdown>
                </BasicModal>
            </>
        );
    }
}

export default Track;
