import React from "react";

interface IProps {
    icon?: React.ReactNode;
    onClick?: () => void;
    text?: string;
    style?: React.CSSProperties;
    id?: string;
    className?: string;
}

class BasicButton extends React.Component<IProps> {
    render() {
        return (
            <button
                className={`BasicButton ${this.props.className}`}
                id={this.props.id}
                style={this.props.style}
                onClick={this.props.onClick}
            >
                {this.props.icon && (this.props.icon)}
                {this.props.text}
            </button>
        );
    }
}

export default BasicButton;
