import React from "react";

import { ImStack } from "react-icons/im";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdShuffle, MdRepeat, MdRepeatOne } from "react-icons/md";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import "rc-slider/assets/index.css";

import ProgressBar from "@components/control/ProgressBar";
import VolumeSlider from "@components/control/VolumeSlider";

import type { TrackData } from "@backend/types";
import { navigate } from "@backend/navigation";
import { favoriteTrack, favorites } from "@backend/user";
import { setVolume, toggleRepeatState } from "@backend/audio";
import TrackPlayer from "@mod/player";

import "@css/layout/ControlPanel.scss";

interface IState {
    queue: boolean;
    playing: boolean;
    track: TrackData | null;
    progress: number;
    volume: number;
    favorite: boolean;

    lastVolume: number;
}

class ControlPanel extends React.Component<any, IState> {
    /**
     * Player update callback.
     */
    update = () => {
        const track = TrackPlayer.getCurrentTrack()?.data;
        this.setState({
            track,
            queue: TrackPlayer.getQueue().length > 0,
            playing: !TrackPlayer.paused,
            favorite: track
                ? favorites.find((t) => t.id == track.id) != null
                : false,
            progress: TrackPlayer.getProgress(),
            volume: Howler.volume() * 100
        });
    };

    constructor(props: any) {
        super(props);

        this.state = {
            queue: false,
            playing: false,
            track: null,
            progress: 0,
            volume: 100,
            favorite: false,
            lastVolume: 100
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
            case "none":
                return (
                    <MdRepeat
                        className={"ControlPanel_Control"}
                        onClick={toggleRepeatState}
                    />
                );

            case "track":
                return (
                    <MdRepeatOne
                        className={"ControlPanel_Control ControlPanel_Repeat"}
                        onClick={toggleRepeatState}
                        style={{ color: "var(--accent-color)" }}
                    />
                );

            case "queue":
                return (
                    <MdRepeat
                        className={"ControlPanel_Control ControlPanel_Repeat"}
                        onClick={toggleRepeatState}
                        style={{ color: "var(--accent-color)" }}
                    />
                );
        }
    }

    render() {
        const { playing, track, favorite } = this.state;

        return (
            <div
                className={"ControlPanel"}
                style={{ pointerEvents: !track ? "none" : "all" }}
            >
                {!track && <div className={"ControlPanel_DisabledOverlay"} />}

                <div className={"ControlPanel_Track"}>
                    {track && (
                        <>
                            <img
                                className={"ControlPanel_Icon"}
                                alt={track.title ?? "No track"}
                                src={
                                    track.icon ??
                                    "https://i.imgur.com/0Q9QZ9A.png"
                                }
                            />

                            <div className={"ControlPanel_TrackInfo"}>
                                <p>{track.title}</p>
                                <p>{track.artist}</p>
                            </div>
                        </>
                    )}
                </div>

                <div className={"ControlPanel_MainControls"}>
                    <div className={"ControlPanel_Controls"}>
                        {favorite ? (
                            <AiFillHeart
                                className={"ControlPanel_Control"}
                                style={{ color: "var(--accent-color)" }}
                                onClick={() => this.favorite()}
                            />
                        ) : (
                            <AiOutlineHeart
                                className={"ControlPanel_Control"}
                                onClick={() => this.favorite()}
                            />
                        )}

                        <MdShuffle
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.shuffle()}
                        />

                        <IoMdSkipBackward
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.back()}
                        />

                        {playing ? (
                            <IoMdPause
                                className={"ControlPanel_Control"}
                                onClick={() => TrackPlayer.pause()}
                            />
                        ) : (
                            <IoMdPlay
                                className={"ControlPanel_Control"}
                                onClick={() => TrackPlayer.pause()}
                            />
                        )}

                        <IoMdSkipForward
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.next()}
                        />

                        {this.getRepeatIcon()}

                        <ImStack
                            className={"ControlPanel_Control"}
                            onClick={() => navigate("Queue")}
                        />
                    </div>

                    <ProgressBar
                        progress={this.state.progress}
                        duration={TrackPlayer.getDuration()}
                        onSeek={(progress) => {
                            this.setState({ progress });
                            TrackPlayer.seek(progress);
                        }}
                    />
                </div>

                <div className={"ControlPanel_Right"}>
                    <VolumeSlider
                        volume={this.state.volume}
                        muted={Howler.volume() == 0}
                        setVolume={(volume) => {
                            this.setState({ volume });
                            setVolume(volume / 100);
                        }}
                        toggleMute={() => {
                            if (Howler.volume() > 0) {
                                this.setState({
                                    lastVolume: Howler.volume() * 100
                                });
                                setVolume(0);
                            } else {
                                setVolume(this.state.lastVolume / 100);
                            }
                        }}
                    />
                    <FiExternalLink className={"ControlPanel_Popout"} />
                </div>
            </div>
        );
    }
}

export default ControlPanel;
