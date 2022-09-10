import { faLightbulb, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { Track } from "backend/music";
import VolumeControl from "components/MusicControls/VolumeControl";
import { Howl } from "howler";
import React from "react";
import Button from "./Button";
import ProgressBar from "./MusicControls/ProgressBar";
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
    songIndex: number;
}

const toggleTrack = (track: Track, state: IState, setState: React.Dispatch<React.SetStateAction<IState>>) => {
    if (track.sound.playing()) {
        track.sound.pause();
        setState({ ...state, playing: false });
    } else {
        track.sound.play();
        setState({ ...state, playing: true });
    }
};

function changeVolume(
    track: Track,
    state: IState,
    value: number,
    setState: React.Dispatch<React.SetStateAction<IState>>
) {
    track.sound.volume(value / 100);
    setState({ ...state, volume: value });
}

const toggleMute = (track: Track, state: IState, setState: React.Dispatch<React.SetStateAction<IState>>) => {
    state.muted ? track.sound.mute(false) : track.sound.mute(true);
    setState({ ...state, muted: !state.muted });
};

const setProgress = (track: Track, value: number) => {
    track.sound.seek(value);
};
let songi = 0;

const exampleTrack = new Track([
    {
        url: "https://app.magix.lol/download?id=fWoxszxtkk4",
    },
    {
        url: "https://app.magix.lol/download?id=e-fA-gBCkj0",
        title: "Locked Out Of Heaven",
        author: "Bruno Mars"
    }
]);


class Controls extends React.Component<IProps, IState> {
    track: Track;
    showControls: true;
    constructor(props: IProps) {
        super(props);
        this.track = exampleTrack;
        this.state = {
            playing: false,
            muted: false,
            volume: 100,
            progress: 0,
            lightshow: false,
            showControls: true,
            songIndex: 0
        };
    }
    originalColors = [];

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

    componentDidMount() {
        this.track.sound.on("end", () => {
            // TODO: fix this scuffed-ass thing :(
            songi += 0.5;
            if (songi % 1 == 0)
                this.track.sound = new Howl({ src: this.track.Songs[songi].url, html5: true });
        });
        setInterval(() => {
            this.setState({ progress: this.track.sound.seek() || 0 });
            this.lightshow();

        }, 100);
    }

    render() {
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
                            onClick={() => this.setState({ lightshow: !this.state.lightshow })}
                            icon={faLightbulb}
                        />
                        <Button
                            className={"control"}
                            tooltip={"play/pause"}
                            onClick={() => toggleTrack(this.track, this.state, this.setState.bind(this))}
                            icon={this.state.playing ? faPause : faPlay}
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
                    <ProgressBar
                        progress={this.state.progress}
                        duration={this.track.sound.duration()}
                        setProgress={(value) => setProgress(this.track, value)}
                    />

                </div>

            </>

        );
    }
}

export default Controls;