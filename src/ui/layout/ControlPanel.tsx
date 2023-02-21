import React from "react";

import { ImStack } from "react-icons/im";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdShuffle, MdRepeat, MdRepeatOne } from "react-icons/md";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import { FiVolumeX, FiVolume1, FiVolume2 } from "react-icons/fi";

import ProgressBar from "@components/control/ProgressBar";

import type { TrackData } from "@backend/types";
import { favoriteTrack, favorites } from "@backend/user";
import { toggleRepeatState } from "@backend/audio";
import TrackPlayer from "@mod/player";

import "@css/layout/ControlPanel.scss";

interface IState {
    queue: boolean;
    playing: boolean;
    track: TrackData | null;
    progress: number;
    favorite: boolean;
}

class ControlPanel extends React.Component<any, IState> {
    /**
     * Player update callback.
     */
    update = () => {
        const track = TrackPlayer.getCurrentTrack()?.data;
        this.setState({ track,
            queue: TrackPlayer.getQueue().length > 0,
            playing: !TrackPlayer.paused,
            favorite: track ? favorites.find(
                t => t.id == track.id) != null : false
        })
    };

    constructor(props: any) {
        super(props);

        this.state = {
            queue: false,
            playing: false,
            track: null,
            progress: 0,
            favorite: false
        };
    }

    componentDidMount() {
        TrackPlayer.on("update", this.update);
    }

    componentWillUnmount() {
        TrackPlayer.off("update", this.update);
    }

    /**
     * Adds the current track to the favorites.
     */
    async favorite(): Promise<void> {
        const { track } = this.state;
        if (!track) return;

        // Toggle the favorite state.
        await favoriteTrack(track, !this.state.favorite);
        this.setState({ favorite: !this.state.favorite });
    }

    /**
     * Gets the icon for the appropriate repeat mode.
     */
    getRepeatIcon(): React.ReactNode {
        switch (TrackPlayer.getRepeatMode()) {
            case "none": return <MdRepeat
                className={"ControlPanel_Control"}
                onClick={toggleRepeatState}
            />;

            case "track": return <MdRepeatOne
                className={"ControlPanel_Control ControlPanel_Repeat"}
                onClick={toggleRepeatState}
                style={{ color: "var(--accent-color)" }}
            />;

            case "queue": return <MdRepeat
                className={"ControlPanel_Control ControlPanel_Repeat"}
                onClick={toggleRepeatState}
                style={{ color: "var(--accent-color)" }}
            />;
        }
    }

    render() {
        const { playing, track, favorite } = this.state;

        return (
            <div className={"ControlPanel"}>
                <div className={"ControlPanel_Track"}>
                    {
                        track && <>
                            <img
                                className={"ControlPanel_Icon"}
                                alt={track.title ?? "No track"}
                                src={track.icon ?? "https://i.imgur.com/0Q9QZ9A.png"}
                            />

                            <div className={"ControlPanel_TrackInfo"}>
                                <p>{track.title}</p>
                                <p>{track.artist}</p>
                            </div>
                        </>
                    }
                </div>

                <div className={"ControlPanel_MainControls"}>
                    <div className={"ControlPanel_Controls"}>
                        {favorite ?
                            <AiFillHeart
                                className={"ControlPanel_Control"}
                                style={{ color: "var(--accent-color)" }}
                                onClick={() => this.favorite()}
                            /> :
                            <AiOutlineHeart
                                className={"ControlPanel_Control"}
                                onClick={() => this.favorite()}
                            />
                        }

                        <MdShuffle
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.shuffle()}
                        />

                        <IoMdSkipBackward
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.back()}
                        />

                        {playing ?
                            <IoMdPause
                                className={"ControlPanel_Control"}
                                onClick={() => TrackPlayer.pause()}
                            /> :
                            <IoMdPlay
                                className={"ControlPanel_Control"}
                                onClick={() => TrackPlayer.pause()}
                            />
                        }

                        <IoMdSkipForward
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.next()}
                        />

                        {this.getRepeatIcon()}

                        <ImStack
                            className={"ControlPanel_Control"}
                            onClick={() => console.log("See Queue")}
                        />
                    </div>

                    <ProgressBar
                        progress={this.state.progress}
                        duration={60}
                        onSeek={(progress) => this.setState({ progress })}
                    />
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
