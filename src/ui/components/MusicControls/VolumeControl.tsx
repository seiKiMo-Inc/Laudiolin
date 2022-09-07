import React from "react";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp, faVolumeDown } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Button } from "react-bootstrap";

interface IProps {
    volume: number;
    muted: boolean;
    setVolume: (value: number) => void;
    toggleMute: () => void;
}

const VolumeControl: React.FC<IProps> = (props) => {
    return (
        <span>
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Mute/Unmute</Tooltip>}>
                <Button
                    id="volume"
                    variant="outline-primary"
                    size="lg"
                    onClick={() => props.toggleMute()}
                    style={{ margin: "10px", marginTop: "10px", maxWidth: "50px", verticalAlign: "middle"}}
                >
                    <FontAwesomeIcon
                        icon={
                            props.muted || props.volume == 0
                                ? faVolumeMute
                                : props.volume
                                    ? faVolumeDown
                                    : faVolumeUp
                        }
                    />
                </Button>
            </OverlayTrigger>
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-top">{props.volume}%</Tooltip>}
            >
                <Form.Control
                    type="range"
                    min="0"
                    max="100"
                    value={props.volume}
                    onChange={(e) => props.setVolume(parseInt(e.target.value))}
                    style={{
                        maxWidth: "100px",
                        height: "10px",
                        display: "inline-block",
                        verticalAlign: "middle",
                        margin: "10px",
                        marginTop: "10px",
                    }}
                    className={"form-range"}
                />
            </OverlayTrigger>
        </span>
    );
};

export default VolumeControl;