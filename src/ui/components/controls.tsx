import React from "react";
import "../App.css";
import Button from "react-bootstrap/Button";
import { Track } from "../../backend/music";

interface IProps {}
interface IState {}



const toggleTrack = (track: Track) => (track.sound.playing() ? track.sound.pause() : track.sound.play());

function changeVolume(track: Track, value: number) {
    track.sound.volume(value / 100);
}

class Controls extends React.Component<IProps, IState> {
    track: Track;

    constructor(props: IProps) {
        super(props);
        this.track = new Track("https://app.magix.lol/download?id=c6rCRy6SrtU&source=YouTube");
        this.track.sound.volume(1);
    }

    render() {
        return (
            <div>

                <Button variant="primary" onClick={() => toggleTrack(this.track)}>
                    pause/play
                </Button>
                <br />

                <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="100"
                    className="slider"
                    onChange={(e) => changeVolume(this.track, parseInt(e.target.value))}
                ></input>
            </div>
        );
    }
}

export default Controls;
