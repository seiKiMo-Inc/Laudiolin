import React from "react";

import { ImStack } from "react-icons/im";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdShuffle, MdRepeat, MdRepeatOne } from "react-icons/md";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

import ProgressBar from "@components/control/ProgressBar";
import VolumeSlider from "@components/control/VolumeSlider";

import WithStore, { asArray, useFavorites, useGlobal } from "@backend/stores";
import { getTrackSource, handleHotKeys, toMini } from "@app/utils";
import { router } from "@app/main";
import { contentRoutes } from "@app/constants";
import { favoriteTrack } from "@backend/social/user";
import { setVolume, toggleRepeatState } from "@backend/core/audio";
import { parseArtist } from "@backend/core/search";
import TrackPlayer, { PlayerState, usePlayer } from "@mod/player";
import { changeState } from "@backend/desktop/altplayer";

import "@css/layout/ControlPanel.scss";
import "rc-slider/assets/index.css";

interface IProps {
    pStore: PlayerState;
}

interface IState {
    volume: number;
    favorite: boolean;

    lastVolume: number;
}

class ControlPanel extends React.Component<IProps, IState> {
    /**
     * Player update callback.
     */
    update = () => {
        const track = this.props.pStore.track;
        this.setState({
            favorite: track
                ? asArray(useFavorites).find((t) => t.id == track.id) != null
                : false,
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
    }

    constructor(props: IProps) {
        super(props);

        this.state = {
            volume: TrackPlayer.volume() * 100,
            favorite: false,
            lastVolume: TrackPlayer.volume() * 100
        };
    }

    componentDidMount() {
        useGlobal.subscribe((state) =>
            this.setState({ volume: state.volume * 100 }));

        // Listen for hotkeys.
        document.addEventListener("keydown", this.hotKeys);
    }

    componentWillUnmount() {
        TrackPlayer.off("update", this.update);

        // Stop listening for hotkeys.
        document.removeEventListener("keydown", this.hotKeys);
    }

    /**
     * Adds the current track to the favorites.
     */
    async favorite(): Promise<void> {
        const { track } = this.props.pStore;
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

    /**
     * Toggles mute
     */
    toggleMute = (): void => {
        if (TrackPlayer.volume() > 0) {
            this.setState({
                lastVolume: TrackPlayer.volume() * 100
            });
            setVolume(0);
        } else {
            setVolume(this.state.lastVolume / 100);
        }
    }

    render() {
        const { favorite } = this.state;
        const { paused, track, progress } = this.props.pStore;

        return (
            <div className={"ControlPanel"}>
                <div className={"ControlPanel_Track"}>
                    {track && (
                        <>
                            <img
                                className={"ControlPanel_Icon"}
                                alt={track.title ?? "No track"}
                                src={
                                    track.refIcon ?? track.icon ??
                                    "https://i.imgur.com/0Q9QZ9A.png"
                                }
                            />

                            <div className={"ControlPanel_TrackInfo"}>
                                <p>{track.title}</p>
                                <p>{parseArtist(track.artist)}</p>
                            </div>
                        </>
                    )}
                </div>

                <div
                    className={"ControlPanel_MainControls"}
                    style={{ pointerEvents: !track ? "none" : "all", opacity: !track ? 0.7 : 1 }}
                >
                    <div className={"ControlPanel_Controls"}>
                        {favorite ? (
                            <AiFillHeart
                                className={"ControlPanel_Control"}
                                style={{ color: "var(--accent-color)" }}
                                onClick={() => this.favorite()}
                                data-tooltip-content={"Remove from favorites"}
                            />
                        ) : (
                            <AiOutlineHeart
                                className={"ControlPanel_Control"}
                                onClick={() => this.favorite()}
                                data-tooltip-content={"Add to favorites"}
                            />
                        )}

                        <MdShuffle
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.shuffle()}
                            data-tooltip-content={"Shuffle"}
                        />

                        <IoMdSkipBackward
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.back()}
                            data-tooltip-content={"Previous"}
                        />

                        {!paused ? (
                            <IoMdPause
                                className={"ControlPanel_Control"}
                                onClick={() => TrackPlayer.pause()}
                                data-tooltip-content={"Pause"}
                            />
                        ) : (
                            <IoMdPlay
                                className={"ControlPanel_Control"}
                                onClick={() => TrackPlayer.pause()}
                                data-tooltip-content={"Play"}
                            />
                        )}

                        <IoMdSkipForward
                            className={"ControlPanel_Control"}
                            onClick={() => TrackPlayer.next()}
                            data-tooltip-content={"Next"}
                        />

                        {this.getRepeatIcon()}

                        <ImStack
                            className={"ControlPanel_Control"}
                            onClick={() => router.navigate(contentRoutes.QUEUE)}
                            data-tooltip-content={"See Queue"}
                        />
                    </div>

                    <ProgressBar
                        progress={progress}
                        forceUpdate={TrackPlayer.forceUpdatePlayer}
                        duration={TrackPlayer.getDuration()}
                        onSeek={(progress) => {
                            TrackPlayer.seek(progress);
                        }}
                    />
                </div>

                <div className={"ControlPanel_Right"}>
                    <VolumeSlider
                        volume={this.state.volume}
                        muted={TrackPlayer.volume() == 0}
                        setVolume={(volume) => {
                            this.setState({ volume });
                            setVolume(volume / 100);
                        }}
                        toggleMute={this.toggleMute}
                    />

                    <FiExternalLink
                        className={"ControlPanel_Popout"}
                        style={{ pointerEvents: !track ? "none" : "all", opacity: !track ? 0.7 : 1 }}
                        onClick={() => {
// #v-ifdef VITE_BUILD_ENV='desktop'
                            changeState("mini");
// #v-else
                            window.open(getTrackSource(track), "_blank");
// #v-endif
                        }}
// #v-ifdef VITE_BUILD_ENV='desktop'
                        onContextMenu={() => changeState("embed")}
// #v-endif
                        data-tooltip-content={(() => {
                            let content = "Open in Browser";
// #v-ifdef VITE_BUILD_ENV='desktop'
                            content = "Popout Player";
// #v-endif
                            return content ?? "";
                        })()}
                    />
                </div>

                <Tooltip anchorSelect={".ControlPanel_Control"} className={"Tooltip"} />
                <Tooltip anchorSelect={".ControlPanel_Popout"} className={"Tooltip"} />
            </div>
        );
    }
}

export default WithStore(ControlPanel, usePlayer);
