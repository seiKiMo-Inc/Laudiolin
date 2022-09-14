import React from "react";

import { player, MusicPlayer } from "@backend/audio";
import Button from "@components/Button";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import VolumeControl from "@components/music/VolumeControl";
import ProgressBarComponent from "@components/music/ProgressBar";

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
        if(muted) player.unmute();
        else player.mute();
    };

    toggleTrackState = () => {
        // Check if the player is playing a song.
        if(player.getCurrentTrack() == null) return;

        // Get the player state.
        const isPlaying = player.isPlaying();

        // Toggle the player state.
        if(isPlaying) player.pause();
        else player.resume();
    }

    componentDidMount() {
        this.seekTask = setInterval(() => {
            this.setState({ progress: player.getProgress() });
        }, 100);

        // Register event listeners for the player.
        player.on("play", () => this.forceUpdate());
        player.on("pause", () => this.forceUpdate());
        player.on("stop", () => this.forceUpdate());
        player.on("volume", () => this.forceUpdate());
    }

    componentWillUnmount() {
        clearInterval(this.seekTask);
    }

    render() {
        return (
            <div className={"controls"}>
                <span
                    style={{
                        display: "table",
                        margin: "0 auto",
                        padding: "10px"
                    }}>

                    <Button
                        className={"control"}
                        tooltip={"play/pause"}
                        icon={player.isPlaying() ? faPause : faPlay}
                        onClick={this.toggleTrackState}
                    />

                    <VolumeControl
                        volume={player.getVolume()}
                        muted={player.getVolume() == 0}
                        setVolume={value => player.setVolume(value)}
                        toggleMute={this.toggleMute}
                    />
                </span>

                <ProgressBarComponent
                    progress={this.state.progress}
                    duration={player.getDuration()}
                    setProgress={() => this.state.progress}
                />
            </div>
        );
    }
}

export default Controls;