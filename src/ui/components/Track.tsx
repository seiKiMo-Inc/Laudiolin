import React from "react";

import { BiHeart } from "react-icons/bi";
import { VscEllipsis } from "react-icons/vsc";

import type { TrackData } from "@backend/types";
import { formatDuration } from "@app/utils";

import "@css/components/Track.scss";

interface IProps {
    track: TrackData;
}

class Track extends React.PureComponent<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { track } = this.props;

        return (
            <div className={"Track"}>
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
