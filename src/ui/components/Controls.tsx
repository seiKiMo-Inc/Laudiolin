import { faLightbulb, faLink, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Track } from "backend/music";
import VolumeControl from "components/MusicControls/VolumeControl";
import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import "../App.css";
import Button from "./Button";
import ProgressBarComponent from "./MusicControls/ProgressBar";
interface IProps { }
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
            }
        } else {
            const elements = document.getElementsByTagName("*");
            for (let i = 0; i < elements.length; i++) {
                const element = (elements[i] as HTMLElement);
                element.style.backgroundColor = this.originalColors[i];
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
                    backgroundColor: "#1a1a1a",
                    padding: "10px",
                }}
            >
                <span
                    style={{
                        display: "table",
                        margin: "0 auto",
                        padding: "10px"
                    }}
                >
                    <Form.Control
                        type="text"
                        placeholder="MP3 URL"
                        className={"form-floating"}
                        value={this.state.url}
                        style={{
                            maxWidth: "10%",
                            display: "inline-block",
                            verticalAlign: "middle",
                        }}
                    />
                    <ButtonGroup>
                        <Button
                            variant="outline-primary"
                            size="lg"
                            onClick={() => this.setURL(this.state.url)}
                        >
                            <FontAwesomeIcon icon={faLink} />
                        </Button>
                        <Button
                            variant="outline-primary"
                            size="lg"
                            onClick={() => toggleTrack(this.track, this.state, this.setState.bind(this))}
                            icon={this.state.playing ? faPause : faPlay}
                        />
                        <Button
                            variant="outline-primary"
                            size="lg"
                            onClick={() => this.setState({ lightshow: !this.state.lightshow })}
                            icon={faLightbulb}
                        />
                    </ButtonGroup>
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