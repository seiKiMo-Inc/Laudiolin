import { faVolumeDown, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "../Button";

interface IProps {
    volume: number;
    muted: boolean;
    setVolume: (value: number) => void;
    toggleMute: () => void;
}

class VolumeControl extends React.Component<IProps, never> {
    render() {
        return (
            <>
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Mute/Unmute</Tooltip>}>
                    <Button
                        variant="outline-primary"
                        size="lg"
                        onClick={() => this.props.toggleMute()}
                        style={{ margin: "10px", marginTop: "10px", maxWidth: "50px" }}
                        icon={
                            this.props.muted || this.props.volume == 0
                                ? faVolumeMute
                                : this.props.volume < 50
                                    ? faVolumeDown
                                    : faVolumeUp
                        }
                    ></Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">{this.props.volume}%</Tooltip>}>
                    <Form.Control
                        type="range"
                        min="0"
                        max="100"
                        value={this.props.volume}
                        onChange={(e) => this.props.setVolume(parseInt(e.target.value))}
                        style={{
                            maxWidth: "100px",
                            height: "10px",
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginTop: "10px",
                            padding: "0px",
                        }}
                        className={"form-range"}
                    />
                </OverlayTrigger>
            </>
        );
    }
}

export default VolumeControl;
