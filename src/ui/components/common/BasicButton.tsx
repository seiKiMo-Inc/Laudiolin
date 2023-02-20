import React from "react";

interface IProps {
    icon?: React.ReactNode;
    onClick?: () => void;
    text?: string;
    style?: React.CSSProperties;
    id?: string;
    className?: string;
    customChildren?: boolean;
    children?: React.ReactNode;

    default?: boolean;
}

class BasicButton extends React.Component<IProps> {
    render() {
        return (
            <button
                className={`BasicButton ${this.props.className}`}
                id={this.props.id}
                style={{
                    borderRadius: 30,
                    padding: 10,
                    gap: 5,
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
