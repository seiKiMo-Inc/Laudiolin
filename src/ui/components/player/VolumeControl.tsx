import { faVolumeDown, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "../common/Button";
import "@css/Controls.scss";

interface IProps {
    volume: number;
    muted: boolean;
    setVolume: (value: number) => void;
    toggleMute: () => void;
}

class VolumeControl extends React.Component<IProps, never> {
    componentDidMount(): void {
        this.props.setVolume(parseInt(localStorage.getItem("volume") as string) || this.props.volume);
    }

    render() {
        return (
            <span id="VolumeControls">
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top" style={{ margin: 0 }}>Mute/Unmute</Tooltip>}>
                    <Button
                        className={"control"}
                        tooltip={this.props.muted ? "Unmute" : "Mute"}
                        onClick={() => this.props.toggleMute()}
                        icon={
                            this.props.muted || this.props.volume == 0
                                ? faVolumeMute
                                : this.props.volume < 50
                                ? faVolumeDown
                                : faVolumeUp
                        }
                    ></Button>
                </OverlayTrigger>

                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top" style={{ margin: 0 }}>{this.props.volume}%</Tooltip>}>
                    <Form.Control
                        type="range"
                        min="0"
                        max="100"
                        value={this.props.volume}
                        onChange={(e) => {
                            localStorage.setItem("volume", e.target.value);
                            this.props.setVolume(parseInt(e.target.value));
                        }}
                        id="VolumeSlider"
                        className={"cursor-pointer"}
                        style={{ verticalAlign: "middle", marginLeft: 25 }}
                    />
                </OverlayTrigger>
            </span>
        );
    }
}

export default VolumeControl;
