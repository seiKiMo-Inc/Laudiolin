import React from "react";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { VscEllipsis } from "react-icons/vsc";

import BasicButton from "@components/common/BasicButton";

import type { TrackData } from "@backend/types";
import { formatDuration, isFavorite } from "@app/utils";
import { favoriteTrack } from "@backend/user";
import { playTrack } from "@backend/audio";

import "@css/components/Track.scss";

interface IProps {
    track: TrackData;
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

    render() {
        const { track } = this.props;
        const favorite = isFavorite(track);

        return (
            <div
                className={"Track"}
                onContextMenu={() => console.log("Open context menu.")}
            >
                <div
                    style={{
                        display: "flex", flexDirection: "row",
                        maxHeight: 67.5, width: "80%",
                    }}
                    onClick={() => this.play()}
                >
                    <img
                        className={"Track_Icon"}
                        alt={track.title}
                        src={track.icon}
                    />

                    <div className={"Track_Info"}>
                        <p>{track.title}</p>
                        <p>{track.artist}</p>
                    </div>
                </div>

                <div className={"Track_Interact"}>
                    <BasicButton
                        icon={favorite ?
                            <AiFillHeart style={{ width: 20, height: 18.18,
                                color: "var(--accent-color)" }} /> :
                            <AiOutlineHeart style={{ width: 20, height: 18.18 }} />}
                        style={{ backgroundColor: "transparent" }}
                        onClick={() => this.favorite()}
                    />
                    <p>{formatDuration(track.duration)}</p>
                    <VscEllipsis />
                </div>
            </div>
        );
    }
}

export default Track;
