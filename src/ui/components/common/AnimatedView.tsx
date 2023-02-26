import React from "react";

interface IProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    reRenderKey?: number;
}

class AnimatedView extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div
                className={`AnimatedView ${this.props.className}`}
                id={this.props.id}
                style={{ ...this.props.style, transform: "translateX(0)" }}
                key={this.props.reRenderKey ?? "0"}
            >
                {this.props.children}
            </div>
        );
    }
}

export default AnimatedView;
