import React, { MouseEvent } from "react";

import ProgressBar from "@components/control/ProgressBar";

import { appWindow } from "@tauri-apps/api/window";

import Slider from "rc-slider/es";

import { FiVolume1 } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdShuffle, MdRepeat, MdRepeatOne } from "react-icons/md";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { VscClose } from "react-icons/vsc";

import WithStore from "@backend/stores";
import { router } from "@app/main";
import { contentRoutes } from "@app/constants";
import { parseArtist } from "@backend/core/search";
import { toMini, handleHotKeys } from "@app/utils";
import { setVolume, toggleRepeatState } from "@backend/core/audio";
import TrackPlayer, { PlayerState, usePlayer } from "@mod/player";

import "@css/components/MiniPlayer.scss";
import { TiPin } from "react-icons/ti";

interface IProps {
    pStore: PlayerState;
}

interface IState {
    volume: number;
    lastVolume: number;
    activeThumb: boolean;

    onTop: boolean;
    holdingAlt: boolean;
}

class MiniPlayer extends React.Component<IProps, IState> {
    /**
     * Player update callback.
     */
    update = () => {
        this.setState({
            volume: TrackPlayer.volume() * 100
        });
    };

    /**
     * Handles a hotkey press.
     * @param e The keyboard event.
     */
    hotKeys = (e: KeyboardEvent) => {
        if (!this.props.pStore.track) return;
        handleHotKeys(e);

        if (e.key == "Alt" || e.key == "Control" || e.key == "Shift") {
            this.setState({ holdingAlt: true });
        }
    };

    onKeyUp = (e: KeyboardEvent) => {
        if (e.key == "Alt" || e.key == "Control" || e.key == "Shift") {
            this.setState({ holdingAlt: false });
        }
    };

    /**
     * Maximizes the window.
     */
    maximizeWindow = async (e: MouseEvent<SVGElement>) => {
        // Check if the user is holding a modifier key.
        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
            const newState = !this.state.onTop;
            await appWindow.setAlwaysOnTop(newState);
            await appWindow.setSkipTaskbar(newState);
            this.setState({ onTop: newState });
        } else {
            toMini(false);

            if (this.state.onTop) {
                await appWindow.setAlwaysOnTop(false);
                await appWindow.setSkipTaskbar(false);
                this.setState({ onTop: false });
            }
        }
    };

    constructor(props: IProps) {
        super(props);

        this.state = {
            volume: TrackPlayer.volume() * 100,
            lastVolume: TrackPlayer.volume() * 100,
            activeThumb: false,
            onTop: false,
            holdingAlt: false
        };
    }

    componentDidMount() {
        TrackPlayer.on("update", this.update);

        // Listen for hotkeys.
        document.addEventListener("keydown", this.hotKeys);
        document.addEventListener("keyup", this.onKeyUp);

        appWindow.setTitle("Laudiolin");
    }

    componentWillUnmount() {
        TrackPlayer.off("update", this.update);

        // Stop listening for hotkeys.
        document.removeEventListener("keydown", this.hotKeys);
        document.removeEventListener("keyup", this.onKeyUp);

        appWindow.setTitle("Laudiolin");
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
        const { paused, track, progress } = this.props.pStore;

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
                {
                    this.state.holdingAlt || this.state.onTop ?
                        <TiPin
                            className={"MiniPlayer_Exit"}
                            onClick={this.maximizeWindow}
                            style={{
                                color: this.state.onTop ? "var(--accent-color)" : "white"
                            }}
                        /> :
                        <VscClose className={"MiniPlayer_Exit"} onClick={this.maximizeWindow} />
                }

                <div className={"MiniPlayer_Track"}>
                    {track && (
                        <>
                            <img
                                className={"MiniPlayer_Icon"}
                                alt={track.title ?? "No track"}
                                src={
                                    track.refIcon ?? track.icon ??
                                    "https://i.imgur.com/0Q9QZ9A.png"
                                }
                            />

                            <div className={"MiniPlayer_Info"}>
                                <p>{track.title}</p>
                                <p>{parseArtist(track.artist)}</p>
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

                        {!paused ? (
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
                        progress={progress}
                        forceUpdate={TrackPlayer.forceUpdatePlayer}
                        duration={TrackPlayer.getDuration()}
                        onSeek={(progress) => {
                            TrackPlayer.seek(progress);
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default WithStore(MiniPlayer, usePlayer);
