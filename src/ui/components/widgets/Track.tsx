import React from "react";
import { open } from "@tauri-apps/api/shell";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { VscEllipsis } from "react-icons/vsc";
import { BiCopy } from "react-icons/bi";

import BasicDropdown, {
    toggleDropdown
} from "@components/common/BasicDropdown";
import Alert from "@components/Alert";

import type { TrackData } from "@backend/types";
import { deleteTrack, deQueue, downloadTrack, playTrack } from "@backend/audio";
import { formatDuration, getIconUrl, isFavorite } from "@app/utils";
import { isDownloaded } from "@backend/offline";
import { favoriteTrack } from "@backend/user";

import "@css/components/Track.scss";
import BasicButton from "@components/common/BasicButton";

interface IProps {
    track: TrackData;
    playlist?: string;
    queue?: boolean;
}

class Track extends React.PureComponent<IProps, never> {
    constructor(props: IProps) {
        super(props);
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
    setDropdownPosition(): void {
        const id = this.props.track.id;
        const dropdown = document.getElementById(`Track_${id}`);
        const button = document.getElementById(`Track_${id}_Button`);

        if (!button || !dropdown) return;

        const buttonRect = button.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();

        const top = buttonRect.top + buttonRect.height;
        const left = buttonRect.left;

        if (top + dropdownRect.height > window.innerHeight) {
            dropdown.style.top = buttonRect.top - dropdownRect.height + "px";
        } else {
            dropdown.style.top = top + "px";
        }

        dropdown.style.left = left + "px";
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

    render() {
        const { track } = this.props;
        const favorite = isFavorite(track);

        return (
            <>
                <div
                    className={"Track"}
                    onClick={() => this.play()}
                    onContextMenu={(event) => {
                        toggleDropdown(
                            `Track_${track.id}`,
                            event.clientX,
                            event.clientY
                        );
                        event.preventDefault();
                    }}
                >
                    <div className={"Track_Info"}>
                        <img
                            className={"Track_Icon"}
                            alt={track.title}
                            src={getIconUrl(track)}
                        />

                        <div className={"Track_Text"}>
                            <p>{track.title}</p>
                            <p>{track.artist}</p>
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
                                onClick={() => this.favorite()}
                            />
                        ) : (
                            <AiOutlineHeart
                                style={{ width: 20, height: 18.18 }}
                                onClick={() => this.favorite()}
                            />
                        )}
                        <BasicButton
                            id={`Track_${track.id}_Button`}
                            icon={<VscEllipsis />}
                            onClick={() => {
                                this.setDropdownPosition();
                                toggleDropdown(`Track_${track.id}`);
                                event.preventDefault();
                            }}
                            className={"dropbtn"}
                            style={{ backgroundColor: "transparent" }}
                        />
                    </div>
                </div>

                <BasicDropdown id={`Track_${track.id}`}>
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

                    {this.props.playlist ? (
                        <a>Remove Track from Playlist</a>
                    ) : (
                        <a>Add Track to Playlist</a>
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

export default Track;
