import React from "react";

import { ImStack } from "react-icons/im";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";
import { MdShuffle, MdRepeat, MdRepeatOne } from "react-icons/md";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";

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
                "icon": "http://192.168.1.2:3000/proxy/LfH3rPgnSPUEU7M7zEN4o4G8Db21Q8r66HxNAZYOjzo1iJtEZnNmFzgivsR9mVTE3GcXoc4-8dI1KC-d=w544-h544-l90-rj?from=cart",
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
                        <p>{track.artist}</p>
                    </div>
                </div>

                <div className={"ControlPanel_Controls"}>
                    <MdShuffle />
                    <IoMdSkipBackward />
                    { playing ? <GiPauseButton /> : <GiPlayButton /> }
                    <IoMdSkipForward />
                    { this.getRepeatIcon() }
                    { queue ? <ImStack /> : null }
                </div>
            </div>
        );
    }
}

export default ControlPanel;
