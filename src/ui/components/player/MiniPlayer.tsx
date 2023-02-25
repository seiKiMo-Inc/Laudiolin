import React from "react";

import ProgressBar from "@components/control/ProgressBar";

import { FiVolume1 } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdShuffle, MdRepeat, MdRepeatOne } from "react-icons/md";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { VscChromeMaximize, VscChromeMinimize, VscClose } from "react-icons/vsc";

import { appWindow } from "@tauri-apps/api/window";

import type { TrackData } from "@backend/types";
import * as settings from "@backend/settings";
import { navigate } from "@backend/navigation";
import { toMini, handleHotKeys } from "@app/utils";
import { toggleRepeatState } from "@backend/audio";
import TrackPlayer from "@mod/player";

import "@css/components/MiniPlayer.scss";

interface IState {
    queue: boolean;
    playing: boolean;
    track: TrackData | null;
    progress: number;
    volume: number;

    lastVolume: number;
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
    }

    /**
     * Closes the window.
     * Hides the window if the setting is set to hide.
     */
    closeWindow = async () => {
        if (settings.system().close == "Exit") {
            await appWindow.close();
        } else {
            await appWindow.hide();
        }
    };

    /**
     * Minimizes the window.
     */
    minimizeWindow = async () => {
        await appWindow.minimize();
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
            lastVolume: 100
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
            >
                <div className={"MiniPlayer_Bar"}
                     data-tauri-drag-region={true}
                >
                    <VscClose className={"TopButtons"} onClick={this.closeWindow} />
                    <VscChromeMaximize
                        className={"TopButtons"}
                        onClick={this.maximizeWindow}
                    />
                    <VscChromeMinimize
                        className={"TopButtons"}
                        onClick={this.minimizeWindow}
                    />
                </div>

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
                        <FiVolume1 className={"MiniPlayer_Control"} />

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
                                setTimeout(() => navigate("Queue"), 300);
                            }}
                        />
                    </div>

                    <div className={"MiniPlayer_Progress"}>
                        <ProgressBar
                            progress={this.state.progress}
                            duration={TrackPlayer.getDuration()}
                            onSeek={(progress) => {
                                this.setState({ progress });
                                TrackPlayer.seek(progress);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default MiniPlayer;
