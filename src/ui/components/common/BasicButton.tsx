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
    tooltipId?: string;
    tooltipContent?: string;
    tooltipFloat?: boolean;
}

class BasicButton extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <button
                className={`${this.props.className} BasicButton`}
                id={this.props.id}
                style={{
                    ...this.props.style
                }}
                onClick={this.props.onClick}
                data-tooltip-id={this.props.tooltipId}
                data-tooltip-content={this.props.tooltipContent}
                data-tooltip-float={this.props.tooltipFloat}
            >
                {this.props.customChildren ? (
                    this.props.children
                ) : (
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
