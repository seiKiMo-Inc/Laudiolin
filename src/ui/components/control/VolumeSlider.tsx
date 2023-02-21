import React from "react";

import { FiVolumeX, FiVolume1, FiVolume2 } from "react-icons/fi";
import Slider from "rc-slider/es";

interface IProps {
    volume: number;
    muted: boolean;
    setVolume: (value: number) => void;
    toggleMute: () => void;
}

interface IState {
    activeThumb: boolean;
}

class VolumeSlider extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            activeThumb: false
        }
    }

    render() {
        return (
            <div
                className={"ControlPanel_Volume"}
                onMouseEnter={() => this.setState({ activeThumb: true })}
                onMouseLeave={() => this.setState({ activeThumb: false })}
            >
                <div className={"ControlPanel_Volume_Icon"} onClick={this.props.toggleMute}>
                    {this.props.muted || this.props.volume === 0 ? <FiVolumeX /> : this.props.volume > 50 ? <FiVolume2 /> : <FiVolume1 />}
                </div>
                <Slider
                    className={"ControlPanel_Volume_Slider"}
                    min={0}
                    max={100}
                    value={this.props.muted ? 0 : this.props.volume}
                    onChange={this.props.setVolume}
                    trackStyle={{ backgroundColor: "var(--accent-color)" }}
                    handleStyle={{
                        display: this.state.activeThumb ? "block" : "none",
                        borderColor: "var(--accent-color)",
                        backgroundColor: "white"
                    }}
                    railStyle={{ backgroundColor: "var(--background-secondary-color)" }}
                    draggableTrack={true}
                />
            </div>
        );
    }
}

export default VolumeSlider;
