import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

interface IState {}

interface IProps {
    icon?: IconDefinition;
    onClick?: () => void;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    id?: string;
    className?: string;
    tooltip?: string;
}

class ButtonWrapper extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        if (this.props.tooltip) {
            return (
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top" style={{ margin: 0 }}>{this.props.tooltip}</Tooltip>}>
                    <button
                        onClick={this.props.onClick}
                        style={this.props.style}
                        id={this.props.id}
                        className={this.props.className}
                    >
                        {this.props.icon ? (
                            <FontAwesomeIcon
                                icon={this.props.icon}
                                style={this.props.children ? { marginRight: "5px", fill: "inherit" } : {}}
                            />
                        ) : null}
                        {this.props.children}
                    </button>
                </OverlayTrigger>
            );
        } else {
            return (
                <button
                    onClick={this.props.onClick}
                    style={this.props.style}
                    id={this.props.id}
                    className={this.props.className}
                >
                    {this.props.icon ? (
                        <FontAwesomeIcon
                            icon={this.props.icon}
                            style={this.props.children ? { marginRight: "5px" } : {}}
                        />
                    ) : null}
                    {this.props.children}
                </button>
            );
        }
    }
}

export default ButtonWrapper;
