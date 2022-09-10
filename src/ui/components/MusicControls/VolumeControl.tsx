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
            <span>
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Mute/Unmute</Tooltip>}>
                    <Button
                        className={"control"}
                        tooltip={"mute/unmute"}
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
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">{this.props.volume}%</Tooltip>}>
                    <Form.Control
                        type="range"
                        min="0"
                        max="100"
                        value={this.props.volume}
                        onChange={(e) => this.props.setVolume(parseInt(e.target.value))}
                        className={"cursor-pointer dark:bg-slate-800 bg-slate-700 h-6"}
                    />
                </OverlayTrigger>
            </span>
        );
    }
}

export default VolumeControl;
