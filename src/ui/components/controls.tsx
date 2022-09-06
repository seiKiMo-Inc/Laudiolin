import React from "react";
import "../App.css";
import Button from "react-bootstrap/Button";
import { Track } from "../../backend/music";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faVolumeMute, faVolumeUp, faVolumeDown } from "@fortawesome/free-solid-svg-icons";

interface IProps {}
interface IState {
    playing: boolean;
    muted: boolean;
    duration: number;
    volume: number;
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

class Controls extends React.Component<IProps, IState> {
    track: Track;

    constructor(props: IProps) {
        super(props);
        this.track = new Track("https://app.magix.lol/download?id=c6rCRy6SrtU&source=YouTube");
        this.state = { playing: false, muted: false, duration: 0, volume: 100 };
    }

    render() {
        return (
            <div>
                <span>
                    <Button
                        variant="outline-primary"
                        size="lg"
                        onClick={() => toggleTrack(this.track, this.state, this.setState.bind(this))}
                    >
                        <FontAwesomeIcon icon={this.state.playing ? faPause : faPlay} />
                    </Button>
                    <span>
                        <Button
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
                        <Form.Control
                            type="range"
                            min="0"
                            max="100"
                            defaultValue={this.state.volume}
                            onChange={(e) => changeVolume(this.track, parseInt(e.target.value), this.setState.bind(this))}
                            style={{ maxWidth: "150px" ,
                                display: "inline-block",
                                verticalAlign: "middle",
                            }}
                        />
                    </span>
                </span>
            </div>
        );
    }
}

export default Controls;
