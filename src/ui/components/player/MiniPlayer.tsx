import React from "react";

import ProgressBar from "@components/control/ProgressBar";

import { FiVolume1 } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdShuffle, MdRepeat, MdRepeatOne } from "react-icons/md";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { VscClose } from "react-icons/vsc";

import type { TrackData } from "@backend/types";
import { router } from "@app/main";
import { contentRoutes } from "@app/constants";
import { toMini, handleHotKeys } from "@app/utils";
import { setVolume, toggleRepeatState } from "@backend/audio";
import TrackPlayer from "@mod/player";

import "@css/components/MiniPlayer.scss";
import Slider from "rc-slider/es";

interface IState {
    queue: boolean;
    playing: boolean;
    track: TrackData | null;
    progress: number;
    volume: number;
    lastVolume: number;
    activeThumb: boolean;
}

class MiniPlayer extends React.Component<any, IState> {
    /**
     * Player update callback.
     */
    update = () => {
        const track = TrackPlayer.getCurrentTrack()?.data;
        this.setState({
            track,
            queue: TrackPlayer.getQueue().length > 0,
            playing: !TrackPlayer.paused,
            progress: TrackPlayer.getProgress(),
            volume: Howler.volume() * 100
        });
    };

    /**
     * Handles a hotkey press.
     * @param e The keyboard event.
     */
    hotKeys = (e: KeyboardEvent) => {
        if (!this.state.track) return;
        handleHotKeys(e);
    };

    /**
     * Maximizes the window.
     */
    maximizeWindow = async () => {
        toMini(false);
    };

    constructor(props: any) {
        super(props);

        this.state = {
            queue: false,
            playing: false,
            track: null,
            progress: 0,
            volume: 100,
            lastVolume: 100,
            activeThumb: false
        };
    }

    componentDidMount() {
        TrackPlayer.on("update", this.update);

        // Listen for hotkeys.
        document.addEventListener("keydown", this.hotKeys);
    }

    componentWillUnmount() {
        TrackPlayer.off("update", this.update);

        // Stop listening for hotkeys.
        document.removeEventListener("keydown", this.hotKeys);
    }

    /**
     * Gets the icon for the appropriate repeat mode.
     */
    getRepeatIcon(): React.ReactNode {
        switch (TrackPlayer.getRepeatMode()) {
            case "none":
                return (
                    <MdRepeat
                        className={"MiniPlayer_Control"}
                        onClick={toggleRepeatState}
                    />
                );

            case "track":
                return (
                    <MdRepeatOne
                        className={"MiniPlayer_Control MiniPlayer_Repeat"}
                        onClick={toggleRepeatState}
                        style={{ color: "var(--accent-color)" }}
                    />
                );

            case "queue":
                return (
                    <MdRepeat
                        className={"MiniPlayer_Control MiniPlayer_Repeat"}
                        onClick={toggleRepeatState}
                        style={{ color: "var(--accent-color)" }}
                    />
                );
        }
    }

    render() {
        const { playing, track } = this.state;

        return (
            <div
                className={"MiniPlayer"}
                onContextMenu={e => e.preventDefault()}
                data-tauri-drag-region={true}
                style={{
                    backgroundImage: `url(${track?.icon ?? ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <VscClose className={"MiniPlayer_Exit"} onClick={this.maximizeWindow} />

                <div className={"MiniPlayer_Track"}>
                    {track && (
                        <>
                            <img
                                className={"MiniPlayer_Icon"}
                                alt={track.title ?? "No track"}
                                src={
                                    track.icon ??
                                    "https://i.imgur.com/0Q9QZ9A.png"
                                }
                            />

                            <div className={"MiniPlayer_Info"}>
                                <p>{track.title}</p>
                                <p>{track.artist}</p>
                            </div>
                        </>
                    )}
                </div>

                <div className={"MiniPlayer_Actions"}>
                    <div className={"MiniPlayer_Controls"}>
                        <div className={"MiniPlayer_Volume"}>
                            <div
                                className={"MiniPlayer_Volume_Slider"}
                                onMouseEnter={() => this.setState({ activeThumb: true })}
                                onMouseLeave={() => this.setState({ activeThumb: false })}
                            >
                                <Slider
                                    min={0}
                                    max={100}
                                    value={this.state.volume}
                                    onChange={(volume: number) => {
                                        this.setState({ volume });
                                        setVolume(volume / 100);
                                    }}
                                    trackStyle={{ backgroundColor: "var(--accent-color)" }}
                                    handleStyle={{
                                        display: this.state.activeThumb ? "block" : "none",
                                        borderColor: "var(--accent-color)",
                                        backgroundColor: "white"
                                    }}
                                    railStyle={{
                                        backgroundColor: "var(--background-secondary-color)"
                                    }}
                                    draggableTrack={true}
                                />
                            </div>

                            <FiVolume1 className={"MiniPlayer_Control MiniPlayer_Volume_Button"} />
                        </div>

                        <MdShuffle
                            className={"MiniPlayer_Control"}
                            onClick={() => TrackPlayer.shuffle()}
                        />

                        <IoMdSkipBackward
                            className={"MiniPlayer_Control"}
                            onClick={() => TrackPlayer.back()}
                        />

                        {playing ? (
                            <IoMdPause
                                className={"MiniPlayer_Control"}
                                onClick={() => TrackPlayer.pause()}
                            />
                        ) : (
                            <IoMdPlay
                                className={"MiniPlayer_Control"}
                                onClick={() => TrackPlayer.pause()}
                            />
                        )}

                        <IoMdSkipForward
                            className={"MiniPlayer_Control"}
                            onClick={() => TrackPlayer.next()}
                        />

                        {this.getRepeatIcon()}

                        <ImStack
                            className={"MiniPlayer_Control"}
                            onClick={() => {
                                toMini(false);
                                setTimeout(() => router.navigate(contentRoutes.QUEUE), 300);
                            }}
                        />
                    </div>
                </div>

                <div className={"MiniPlayer_Progress"}>
                    <ProgressBar
                        className={"MiniPlayer_ProgressBar"}
                        progress={this.state.progress}
                        duration={TrackPlayer.getDuration()}
                        onSeek={(progress) => {
                            this.setState({ progress });
                            TrackPlayer.seek(progress);
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default MiniPlayer;
