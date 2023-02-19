import React from "react";

import { BiHeart } from "react-icons/bi";
import { VscEllipsis } from "react-icons/vsc";

import type { TrackData } from "@backend/types";
import { formatDuration } from "@app/utils";
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

    render() {
        const { track } = this.props;

        return (
            <div
                className={"Track"}
                onClick={() => this.play()}
                onContextMenu={() => console.log("Open context menu.")}
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

                <div className={"Track_Interact"}>
                    <BiHeart style={{ width: 20, height: 18.18 }} />
                    <p>{formatDuration(track.duration)}</p>
                    <VscEllipsis />
                </div>
            </div>
        );
    }
}

export default Track;
