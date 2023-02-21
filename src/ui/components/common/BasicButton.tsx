import React, { MouseEvent } from "react";

interface IProps {
    icon?: React.ReactNode;
    onClick?: (event: MouseEvent) => void;
    text?: string;
    style?: React.CSSProperties;
    id?: string;
    className?: string;
    customChildren?: boolean;
    children?: React.ReactNode;
}

class BasicButton extends React.Component<IProps> {
    render() {
        return (
            <button
                className={`BasicButton ${this.props.className}`}
                id={this.props.id}
                style={{
                    ...this.props.style,
                }}
                onClick={this.props.onClick}
            >
                {this.props.customChildren ? this.props.children : (
                    <>
                        {this.props.icon ? this.props.icon : null}
                        {this.props.text ? this.props.text : null}
                    </>
                )}
            </button>
        );
    }
}

export default BasicButton;
