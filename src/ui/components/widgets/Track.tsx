import React from "react";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { VscEllipsis } from "react-icons/vsc";

import BasicDropdown, { toggleDropdown } from "@components/common/BasicDropdown";

import type { TrackData } from "@backend/types";
import { deleteTrack, downloadTrack, playTrack } from "@backend/audio";
import { formatDuration, getIconUrl, isFavorite } from "@app/utils";
import { isDownloaded } from "@backend/offline";
import { favoriteTrack } from "@backend/user";

import "@css/components/Track.scss";
import BasicButton from "@components/common/BasicButton";

interface IProps {
    track: TrackData;
    playlist?: string;
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
            dropdown.style.top = (buttonRect.top - dropdownRect.height) + "px";
        } else {
            dropdown.style.top = top + "px";
        }

        dropdown.style.left = left + "px";
    }

    render() {
        const { track } = this.props;
        const favorite = isFavorite(track);

        return (
            <div
                className={"Track"}
                onClick={() => this.play()}
                onContextMenu={event => {
                    toggleDropdown(`Track_${track.id}`, event.clientX, event.clientY);
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
                    {favorite ?
                        <AiFillHeart style={{ width: 20, height: 18.18, color: "var(--accent-color)" }} onClick={() => this.favorite()} /> :
                        <AiOutlineHeart style={{ width: 20, height: 18.18 }} onClick={() => this.favorite()} />
                    }
                    <BasicButton
                        id={`Track_${track.id}_Button`}
                        icon={<VscEllipsis />}
                        onClick={() => {
                            this.setDropdownPosition();
                            toggleDropdown(`Track_${track.id}`);
                            event.preventDefault();
                        }}
                        style={{ backgroundColor: "transparent" }}
                    />
                </div>

                <BasicDropdown id={`Track_${track.id}`}>
                    {
                        isDownloaded(track) ?
                            <a onClick={() => deleteTrack(track)}>Delete Track</a> :
                            <a onClick={() => downloadTrack(track)}>Download Track</a>
                    }

                    {
                        this.props.playlist ?
                            <a>Remove Track from Playlist</a> :
                            <a>Add Track to Playlist</a>
                    }
                </BasicDropdown>
            </div>
        );
    }
}

export default Track;
