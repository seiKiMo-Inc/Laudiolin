import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React from "react";
import { Button } from "react-bootstrap";
import { ButtonVariant } from "react-bootstrap/esm/types";

interface IState { }

interface IProps {
    icon?: IconDefinition;
    onClick: () => void;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    id?: string;
    className?: string;
    size?: "sm" | "lg";
    variant?: ButtonVariant
}

class ButtonWrapper extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <Button
                variant={this.props.variant || (document.documentElement.classList.contains("dark") ? "outline-light" : "outline-secondary")}
                onClick={this.props.onClick}
                style={this.props.style}
                size={this.props.size}
                id={this.props.id}
                className={this.props.className}
            >
                {this.props.icon ? <FontAwesomeIcon icon={this.props.icon} style={this.props.children ? { marginRight: "5px" } : {}} /> : null}
                {this.props.children}
            </Button>
        );
    }
}

export default ButtonWrapper;
