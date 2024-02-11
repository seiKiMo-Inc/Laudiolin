import React, { useState, useEffect } from "react";

import ProgressBar from "@components/control/ProgressBar";

import { VscClose } from "react-icons/vsc";
import { MdSkipNext } from "react-icons/md";
import { IoPauseCircle, IoPlayCircle } from "react-icons/io5";

import { FastAverageColor } from "fast-average-color";
import { invoke, window as taoWindow } from "@tauri-apps/api";

import { useSettings } from "@backend/stores";
import { getIconUrl, getRgb } from "@app/utils";
import TrackPlayer, { usePlayer } from "@mod/player";
import { changeState } from "@backend/desktop/altplayer";

import "@css/components/EmbedPlayer.scss";

const { appWindow } = taoWindow;

/**
 * Adjusts the volume based on the scroll wheel.
 *
 * @param delta The scroll wheel delta.
 * @param invert Whether to invert the scroll wheel.
 */
function changeVolume(delta: number, invert: boolean): void {
    delta = invert ? -delta : delta;
    const newVolume = (TrackPlayer.volume() + (delta / 100));
    TrackPlayer.volume(newVolume);
}

function EmbedPlayer() {
    const settings = useSettings();
    const playerState = usePlayer();
    const { track } = playerState;

    const [color, setColor] = useState("0, 0, 0");

    useEffect(() => {
        (async() => {
            await invoke("move_to_bottom");
            await appWindow.setSkipTaskbar(true);

            // Find the average color of the album art.
            if (track) {
                const fac = new FastAverageColor();
                const iconUrl = getIconUrl(track);
                const result = await fac.getColorAsync(iconUrl);
                setColor(getRgb(result.rgb));
            }
        })();
    }, [track]);

    return (
        <div className={"EmbedPlayer"}
             data-tauri-drag-region={true}
             onContextMenu={e => e.preventDefault()}
             onWheel={e => changeVolume(Math.sign(e.deltaY), settings.system.invert_scroll)}
             style={{ backgroundColor: `rgba(${color}, 0.5)` }}
        >
            <VscClose className={"EmbedPlayer_Exit"}
                      onClick={() => changeState("full")}
            />

            <div className={"EmbedPlayer_Content"}>
                {
                    track ?
                        <img className={"EmbedPlayer_TrackIcon"}
                             src={track.icon} draggable={false}
                             alt={"Track Icon"} />:
                        <span className={"EmbedPlayer_TrackIcon"} />
                }

                <div className={"EmbedPlayer_TrackInfo"}>
                    <div>
                        <p className={"EmbedPlayer_Label"}
                           style={{ fontWeight: "bold" }}>{track?.title ?? "Not Playing"}</p>
                        <p className={"EmbedPlayer_Label"} style={{ fontSize: "14px" }}>{track?.artist ?? "---"}</p>
                    </div>

                    <ProgressBar
                        className={"EmbedPlayer_ProgressBar"}
                        progress={playerState.progress}
                        forceUpdate={TrackPlayer.forceUpdatePlayer}
                        duration={TrackPlayer.getDuration()}
                        onSeek={(progress) => {
                            TrackPlayer.seek(progress);
                        }}
                    />
                </div>
            </div>

            <div className={"EmbedPlayer_Actions"}>
                <MdSkipNext
                    style={{ fontSize: "32px" }}
                    className={"EmbedPlayer_Button"}
                    onClick={() => TrackPlayer.next()}
                />

                {
                    playerState.paused ?
                        <IoPlayCircle className={"EmbedPlayer_Button"}
                                      onClick={() => TrackPlayer.pause()} /> :
                        <IoPauseCircle className={"EmbedPlayer_Button"}
                                       onClick={() => TrackPlayer.pause()} />
                }
            </div>
        </div>
    );
}

export default EmbedPlayer;
