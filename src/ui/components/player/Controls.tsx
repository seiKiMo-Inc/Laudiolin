import React from "react";

import { player, MusicPlayer } from "@backend/audio";
import Button from "@components/Button";
import { faPause, faPlay, faForward, faBackward } from "@fortawesome/free-solid-svg-icons";
import VolumeControl from "@components/music/VolumeControl";
import ProgressBarComponent from "@components/music/ProgressBar";

import "@css/Controls.scss";

interface IProps {
    player: MusicPlayer;
}
interface IState {
    showControls: boolean;
    progress: number;
}

class Controls extends React.Component<IProps, IState> {
    private seekTask = null;

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

        // Get the player state.
        const isPlaying = player.isPlaying();

        // Toggle the player state.
        if (isPlaying) player.pause();
        else player.resume();
    };

    setProgress = (progress) => {
        // Check if the player is playing a song.
        if (player.getCurrentTrack() == null) return;

        // Set the player progress.
        player.setProgress(progress);
    };

    componentDidMount() {
        this.seekTask = setInterval(() => {
            this.setState({ progress: player.getProgress() });
        }, 100);

        // Register event listeners for the player.
        player.on("play", () => this.forceUpdate());
        player.on("pause", () => this.forceUpdate());
        player.on("stop", () => this.forceUpdate());
        player.on("volume", () => this.forceUpdate());
        player.on("seek", () => this.forceUpdate());
    }

    componentWillUnmount() {
        clearInterval(this.seekTask);
    }

    lmao = () => {
        alert("lmao gotta implement this later");
    };

    render() {
        return (
            <div className={"controls"}>
                <span id="controls-components">
                    <Button className={"control"} icon={faBackward} onClick={this.lmao} />

                    <Button
                        className={"control"}
                        tooltip={"play/pause"}
                        icon={player.isPlaying() ? faPause : faPlay}
                        onClick={this.toggleTrackState}
                    />

                    <Button className={"control"} icon={faForward} onClick={this.lmao} />

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
