import React from "react";

import { player, MusicPlayer } from "@backend/audio";
import Button from "@components/common/Button";
import { faPause, faPlay, faForward, faBackward, faShuffle, faRepeat } from "@fortawesome/free-solid-svg-icons";
import VolumeControl from "@components/player/VolumeControl";
import ProgressBarComponent from "@components/player/ProgressBar";

import "@css/Controls.scss";

interface IProps {
    player: MusicPlayer;
}
interface IState {
    showControls: boolean;
    progress: number;
    repeatTooltip: string;
}

class Controls extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            showControls: true,
            progress: 0,
            repeatTooltip: "Enable Queue Loop",
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

    toggleLoopState = () => {
        // Switch to the current loop state.
        switch (player.getLoopState()) {
            case 0:
                player.setLoopState(2);
                this.setState({ repeatTooltip: "Enable Track Loop" });
                break;
            case 2:
                player.setLoopState(1);
                this.setState({ repeatTooltip: "Disable Loop" });
                break;
            case 1:
                player.setLoopState(0);
                this.setState({ repeatTooltip: "Enable Queue Loop" });
                break;
        }
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
            <>
                <div className={"controls"}>
                    <span id="controls-components">
                        {player.getCurrentTrack() != null ? (
                            <div id="current-track-text">
                                <h3>{player.getCurrentTrack().getData().title}</h3>
                                <h4>{player.getCurrentTrack().getData().artist}</h4>
                            </div>
                        ) : (
                            ""
                        )}

                        <Button className={"control"} icon={faShuffle} onClick={() => player.shuffle()} tooltip="Shuffle Queue" />

                        <Button className={"control"} icon={faBackward} onClick={() => player.backTrack()} tooltip="Previous" />

                        <Button
                            className={"control"}
                            icon={player.isPlaying() ? faPause : faPlay}
                            onClick={this.toggleTrackState}
                            tooltip={player.isPlaying() ? "Pause" : "Play"}
                        />

                        <Button className={"control"} icon={faForward} onClick={() => player.skipTrack()} tooltip="Next" />

                        <Button className={"control"} icon={faRepeat} onClick={this.toggleLoopState} tooltip={this.state.repeatTooltip} />

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

                {player.getCurrentTrack() != null ? (
                    <div className={"current-track"}>
                        <img src={player.getCurrentTrack().getData().icon} alt={"current-track-img"} />
                    </div>
                ) : (
                    ""
                )}
            </>
        );
    }
}

export default Controls;
