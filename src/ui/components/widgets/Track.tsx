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
import BasicModal from "@components/common/BasicModal";

import type { TrackData } from "@app/types";
import {
    deQueue, playTrack,
// #v-ifdef VITE_BUILD_ENV='desktop'
    deleteTrack, downloadTrack
// #v-endif
} from "@backend/core/audio";
import { fetchPlaylist, removeTrackFromPlaylist } from "@backend/core/playlist";
import { formatDuration, getIconUrl, getTrackSource, isFavorite } from "@app/utils";
// #v-ifdef VITE_BUILD_ENV='desktop'
import { isDownloaded } from "@backend/desktop/offline";
// #v-endif
import { favoriteTrack } from "@backend/social/user";
import { parseArtist } from "@backend/core/search";

import WithStore, { GlobalState, useGlobal } from "@backend/stores";

import "@css/components/Track.scss";

interface IProps {
    pStore: GlobalState;

    track: TrackData;
    playlist?: string;
    queue?: boolean;
}

interface IState {
    inPlaylist: string | null;
}

class Track extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
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

        const trackUrl = getTrackSource(track);

        // #v-ifdef VITE_BUILD_ENV='desktop'
        await open(trackUrl);
        // #v-else
        window.open(trackUrl, "_blank");
        // #v-endif
    }

    /**
     * Copies the track URL to the clipboard.
     */
    async copyUrl(): Promise<void> {
        const track = this.props.track;
        if (!track) return;

        await navigator.clipboard.writeText(getTrackSource(track));
        Alert.showAlert("Copied URL to clipboard.", <BiCopy />);
    }

    /**
     * Adds this track to a playlist.
     */
    async addToPlaylist(): Promise<void> {
        this.props.pStore.setTrack(this.props.track);
        setTimeout(() => {
            BasicModal.showModal(`Track_${this.props.track.id}_Playlist`,
                inPlaylist => this.setState({ inPlaylist }));
        }, 100);
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
// #v-ifdef VITE_BUILD_ENV='desktop'
                    {isDownloaded(track) ? (
                        <a onClick={() => deleteTrack(track)}>Delete Track</a>
                    ) : (
                        <a onClick={() => downloadTrack(track)}>
                            Download Track
                        </a>
                    )}
// #v-endif

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
            </>
        );
    }
}

export default WithStore(Track, useGlobal);
