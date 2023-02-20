import React from "react";

import { ImStack } from "react-icons/im";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";
import { MdShuffle, MdRepeat, MdRepeatOne } from "react-icons/md";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import { FiVolumeX, FiVolume1, FiVolume2 } from "react-icons/fi";

import type { TrackData } from "@backend/types";

import "@css/layout/ControlPanel.scss";

interface IState {
    queue: boolean;
    playing: boolean;
    track: TrackData | null;
}

class ControlPanel extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            queue: true,
            playing: true,
            track: {
                "title": "hikarunara",
                "artist": "Goose House",
                "icon": "https://i.scdn.co/image/ab67616d00001e020735b9b1d06b65bbd8814825",
                "url": "https://youtu.be/IeJTNN8_jLI",
                "id": "IeJTNN8_jLI",
                "duration": 255
            }
        };
    }

    getRepeatIcon(): React.ReactNode {
        return <MdRepeat />;
    }

    render() {
        const { queue, playing, track } = this.state;
        const isFavorite = true;

        return (
            <div className={"ControlPanel"}>
                <div className={"ControlPanel_Track"}>
                    <img
                        className={"ControlPanel_Icon"}
                        alt={track.title ?? "No track"}
                        src={track.icon ?? "https://i.imgur.com/0Q9QZ9A.png"}
                    />

                    <div className={"ControlPanel_TrackInfo"}>
                        <p>{track.title}</p>
                        <p>{track.artist} aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                    </div>
                </div>

                <div className={"ControlPanel_MainControls"}>
                    <div className={"ControlPanel_Controls"}>
                        { isFavorite ? <AiFillHeart style={{ color: "var(--accent-color)" }} /> : <AiOutlineHeart /> }
                        <MdShuffle />
                        <IoMdSkipBackward />
                        { playing ? <GiPauseButton /> : <GiPlayButton /> }
                        <IoMdSkipForward />
                        { this.getRepeatIcon() }
                        { queue ? <ImStack /> : null }
                    </div>

                    <input type={"range"} className={"ControlPanel_ProgressBar"} />
                </div>

                <div className={"ControlPanel_Right"}>
                    <FiVolume2 />
                    <input type={"range"} className={"ControlPanel_Volume"} />
                    <FiExternalLink />
                </div>
            </div>
        );
    }
}

export default ControlPanel;
