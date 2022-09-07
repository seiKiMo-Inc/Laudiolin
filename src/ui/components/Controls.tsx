import React from "react";
import "../App.css";
import Button from "react-bootstrap/Button";
import { Track } from "backend/music";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faLink, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import ProgressBarComponent from "./MusicControls/ProgressBar";
import VolumeControl from "./MusicControls/VolumeControl";

interface IProps {}
interface IState {
    playing: boolean;
    muted: boolean;
    volume: number;
    progress: number;
    url: string;
    lightshow: boolean;
}

const toggleTrack = (track: Track, state: IState, setState: React.Dispatch<React.SetStateAction<IState>>) => {
    track.sound.playing() ? track.sound.pause() : track.sound.play();
    setState({ ...state, playing: !state.playing });
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



class Controls extends React.Component<IProps, IState> {
    track: Track;

    constructor(props: IProps) {
        super(props);
        this.track = new Track("https://app.magix.lol/download?id=fWoxszxtkk4&source=YouTube");
        this.state = {
            playing: false,
            muted: false,
            volume: 100,
            progress: 0,
            url: "",
            lightshow: false,


        };
    }
    originalColors = [];

    lightshow() {
        if (this.state.lightshow) {
            const elements = document.getElementsByTagName("*");
            for (let i = 0; i < elements.length; i++) {
                const element = (elements[i] as HTMLElement);
                this.originalColors.push(element.style.backgroundColor);
                element.style.backgroundColor =
                    "#" + Math.floor(Math.random() * 16777215).toString(16);
                setTimeout(() => {
                    element.style.backgroundColor = this.originalColors[i];
                }, 500);
            }
        }
    }
    setURL = (url: string) => {
        this.track.sound.stop();
        this.track = new Track(url);
        this.setState({ url: url });
    };

    componentDidMount() {
        this.track.sound.on("end", () => {
            this.setState({ playing: false });
        });
        setInterval(() => {
            this.setState({ progress: this.track.sound.seek() || 0 });
            this.lightshow();

        }, 100);
    }

    render() {
        return (
            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: "#212529",
                    padding: "10px",
                }}
            >
                <span
                    style={{
                        display: "table",
                        margin: "0 auto",
                    }}
                >
                    <Form.Control
                        type="text"
                        placeholder="MP3 URL"
                        className={"form-floating"}
                        value={this.state.url}
                        style={{
                            maxWidth: "150px",
                            display: "inline-block",
                            verticalAlign: "middle",
                        }}
                    />
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Load URL</Tooltip>}>
                        <Button
                            variant="outline-primary"
                            size="lg"
                            onClick={() => this.setURL(this.state.url)}
                            style={{ margin: "10px", marginTop: "10px", marginRight: "5px" }}
                        >
                            <FontAwesomeIcon icon={faLink} />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Play/Pause</Tooltip>}>
                        <Button
                            variant="outline-primary"
                            size="lg"
                            onClick={() => toggleTrack(this.track, this.state, this.setState.bind(this))}
                            style={{ margin: "10px", marginTop: "10px", marginRight: "5px" }}
                        >
                            <FontAwesomeIcon icon={this.state.playing ? faPause : faPlay} />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Lightshow Mode</Tooltip>}>
                        <Button
                            variant="outline-primary"
                            size="lg"
                            onClick={() => this.setState({ lightshow: !this.state.lightshow })}
                            style={{ margin: "10px", marginTop: "10px", marginRight: "5px" }}
                        >
                            <FontAwesomeIcon icon={faLightbulb} />
                        </Button>
                    </OverlayTrigger>
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
                    duration={this.track.sound.duration()}
                    setProgress={(value) => setProgress(this.track, value)}
                />
            </div>
        );
    }
}

export default Controls;