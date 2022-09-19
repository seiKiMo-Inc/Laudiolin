import React from "react";

import { player, MusicPlayer } from "@backend/audio";
import Button from "@components/Button";
import { faPause, faPlay, faForward, faBackward } from "@fortawesome/free-solid-svg-icons";
import VolumeControl from "@components/player/VolumeControl";
import ProgressBarComponent from "@components/player/ProgressBar";

import "@css/Controls.scss";

interface IProps {
    player: MusicPlayer;
}
interface IState {
    showControls: boolean;
    progress: number;
}

class Controls extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            showControls: true,
            progress: 0
        };
    }

    toggleMute = () => {
        // Get the mute state.
        const muted = player.getVolume() == 0;

        // Toggle the mute state.
        if (muted) player.unmute();
        else player.mute();
    };

    toggleTrackState = () => {
        // Check if the player is playing a song.
        if (player.getCurrentTrack() == null) return;
        // Toggle the player state.
        player.togglePlayback();
    };

    setProgress = (progress) => {
        // Check if the player is playing a song.
        if (player.getCurrentTrack() == null) return;
        // Set the player progress.
        player.setProgress(progress);
    };

    componentDidMount() {
        // Register event listeners for the player.
        player.on("play", () => this.forceUpdate());
        player.on("end", () => this.forceUpdate());
        player.on("pause", () => this.forceUpdate());
        player.on("resume", () => this.forceUpdate());
        player.on("volume", () => this.forceUpdate());
        player.on("seek", () => this.forceUpdate());
        player.on("stop", () => this.forceUpdate());
        player.on("update", () => this.forceUpdate());
    }

    render() {
        return (
            <div className={"controls"}>
                <span id="controls-components">
                    <Button className={"control"} icon={faBackward} onClick={() => player.backTrack()} />

                    <Button
                        className={"control"}
                        icon={player.isPlaying() ? faPause : faPlay}
                        onClick={this.toggleTrackState}
                    />

                    <Button className={"control"} icon={faForward} onClick={() => player.skipTrack()} />

                    <VolumeControl
                        volume={player.getVolume()}
                        muted={player.getVolume() == 0}
                        setVolume={(value) => player.setVolume(value)}
                        toggleMute={this.toggleMute}
                    />
                </span>

                <ProgressBarComponent
                    progress={player.getProgress()}
                    duration={player.getDuration()}
                    setProgress={this.setProgress}
                />
            </div>
        );
    }
}

export default Controls;
