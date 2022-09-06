import React from "react";
import "../App.css";
import Button from "react-bootstrap/Button";
import { Track } from "backend/music";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faPause,
    faVolumeMute,
    faVolumeUp,
    faVolumeDown,
    faLink,
} from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ProgressBar from "react-bootstrap/ProgressBar";

interface IProps {}
interface IState {
    playing: boolean;
    muted: boolean;
    volume: number;
    progress: number;
    url: string;
}

const toggleTrack = (track: Track, state: IState, setState: any) => {
    track.sound.playing() ? track.sound.pause() : track.sound.play();
    setState({ playing: !state.playing });
};

function changeVolume(track: Track, value: number, setState: any) {
    track.sound.volume(value / 100);
    setState({ volume: value });
}

const toggleMute = (track: Track, state: IState, setState: any) => {
    state.muted ? track.sound.mute(false) : track.sound.mute(true);
    setState({ muted: !state.muted });
};

const setProgress = (track: Track, value: number, setState: any) => {
    track.sound.seek(value);
};

class Controls extends React.Component<IProps, IState> {
    track: Track;

    constructor(props: IProps) {
        super(props);
        this.track = new Track("https://app.magix.lol/download?id=c6rCRy6SrtU&source=YouTube");
        this.state = { playing: false, muted: false, volume: 100, progress: 0, url: "" };
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
                        placeholder="URL"
                        className={"form-floating"}
                        value={this.state.url}
                        style={{
                            maxWidth: "150px",
                            display: "inline-block",
                            verticalAlign: "middle",
                        }}
                    />
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-top">Load URL</Tooltip>}
                    >
                        <Button
                            variant="outline-primary"
                            size="lg"
                            onClick={() => this.setURL(this.state.url)}
                            style={{ margin: "10px", marginTop: "10px" }}
                        >
                            <FontAwesomeIcon icon={faLink} />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-top">Play/Pause</Tooltip>}
                    >
                        <Button
                            variant="outline-primary"
                            size="lg"
                            onClick={() => toggleTrack(this.track, this.state, this.setState.bind(this))}
                        >
                            <FontAwesomeIcon icon={this.state.playing ? faPause : faPlay} />
                        </Button>
                    </OverlayTrigger>
                    <span>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-top">Mute/Unmute</Tooltip>}
                        >
                            <Button
                                id="volume"
                                variant="outline-primary"
                                size="lg"
                                onClick={() => toggleMute(this.track, this.state, this.setState.bind(this))}
                                style={{ margin: "10px", marginTop: "10px" }}
                            >
                                <FontAwesomeIcon
                                    icon={
                                        this.state.muted || this.state.volume == 0
                                            ? faVolumeMute
                                            : this.state.volume < 50
                                                ? faVolumeDown
                                                : faVolumeUp
                                    }
                                />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-top">{this.state.volume}%</Tooltip>}
                        >
                            <Form.Control
                                type="range"
                                min="0"
                                max="100"
                                value={this.state.volume}
                                onChange={(e) =>
                                    changeVolume(this.track, parseInt(e.target.value), this.setState.bind(this))
                                }
                                style={{
                                    maxWidth: "100px",
                                    height: "10px",
                                    display: "inline-block",
                                    verticalAlign: "middle",
                                    margin: "10px",
                                    marginTop: "10px",
                                }}
                                className={"form-range"} />
                        </OverlayTrigger>
                    </span>
                </span>
                <ProgressBar
                    style={{ height: "10px", backgroundColor: "#eee"}}
                    now={(this.state.progress / this.track.sound.duration()) * 100}
                    onClick={(e) =>
                        setProgress(
                            this.track,
                            (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) *
                                this.track.sound.duration(),
                            this.setState.bind(this)
                        )
                    }
                />
            </div>
        );
    }
}

export default Controls;