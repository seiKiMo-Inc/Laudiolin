import React from "react";
import { faLightbulb, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import VolumeControl from "@components/music/VolumeControl";
import Button from "./Button";
import ProgressBarComponent from "@components/music/ProgressBar";

import { Track } from "@backend/audio";

interface IProps {
    style?: React.CSSProperties
}
interface IState {
    playing: boolean;
    muted: boolean;
    volume: number;
    progress: number;
    lightshow: boolean;
    showControls: boolean;
}

const toggleTrack = (track: Track|undefined, state: IState, setState: React.Dispatch<React.SetStateAction<IState>>) => {
    track?.isPlaying() ? track?.pause() : track?.resume();
    setState({ ...state, playing: !state.playing });
};

function changeVolume(
    track: Track|undefined,
    state: IState,
    value: number,
    setState: React.Dispatch<React.SetStateAction<IState>>
) {
    track?.volume(value / 100);
    setState({ ...state, volume: value });
}

const toggleMute = (track: Track|undefined, state: IState, setState: React.Dispatch<React.SetStateAction<IState>>) => {
    state.muted ? track?.unmute() : track?.mute();
    setState({ ...state, muted: !state.muted });
};

const setProgress = (track: Track|undefined, value: number) => {
    track?.seek(value);
};

class Controls extends React.Component<IProps, IState> {
    track: Track|undefined;
    showControls: boolean = true;
    originalColors: string[] = [];

    constructor(props: IProps) {
        super(props);
        // this.track = new Track("https://app.magix.lol/download?id=fWoxszxtkk4&source=YouTube");
        this.state = {
            playing: false,
            muted: false,
            volume: 100,
            progress: 0,
            lightshow: false,
            showControls: true
        };
    }

    lightshow() {
        const elements = document.getElementsByTagName("*");
        if (this.state.lightshow) {
            for (let i = 0; i < elements.length; i++) {
                const element = (elements[i] as HTMLElement);
                this.originalColors.push(element.style.backgroundColor);
                element.style.backgroundColor =
                    "#" + Math.floor(Math.random() * 16777215).toString(16);
            }
        } else {
            for (let i = 0; i < elements.length; i++)
                (elements[i] as HTMLElement).style.backgroundColor = this.originalColors[i];
        }
    }

    toggleControls = () => {
        this.setState({ showControls: !this.state.showControls });
    };

    setURL = (url: string) => {
        this.track?.stop();
        // this.track = new Track(url);
        this.setState({ playing: false });
    };

    async componentDidMount() {
        // this.track.on("end", () => {
        //     this.setState({ playing: false });
        // });
        setInterval(() => {
            this.setState({ progress: this.track?.seek() || 0 });
            this.lightshow();

        }, 100);
    }

    render() {
        // @ts-ignore
        return (
            <>
                <div
                    style={{
                        display: this.state.showControls ? "unset" : "none"
                    }}
                    className={"controls"}
                >
                    <span
                        style={{
                            display: "table",
                            margin: "0 auto",
                            padding: "10px"
                        }}
                    >
                        <Button
                            className={"control"}
                            tooltip={"play/pause"}
                            onClick={() => toggleTrack(this.track, this.state, this.setState.bind(this))}
                            icon={this.state.playing ? faPause : faPlay}
                        />
                        <Button
                            className={"control"}
                            onClick={() => this.setState({ lightshow: !this.state.lightshow })}
                            icon={faLightbulb}
                        />
                        <VolumeControl
                            volume={this.state.volume}
                            muted={this.state.muted}
                            setVolume={(value) =>
                                changeVolume(this.track, this.state, value, this.setState.bind(this))
                            }
                            toggleMute={() => toggleMute(this.track, this.state, this.setState.bind(this))}
                        />
                    </span>
                    <ProgressBarComponent
                        progress={this.state.progress}
                        duration={this.track?.duration() || 0}
                        setProgress={(value) => setProgress(this.track, value)}
                    />

                </div>

            </>

        );
    }
}

export default Controls;