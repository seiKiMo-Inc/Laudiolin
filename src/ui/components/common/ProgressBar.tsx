import React from "react";

import "@css/ProgressBar.css";

interface IProps {
    progress: number;
    color: string;

    className?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

class ProgressBar extends React.Component<IProps, never> {
    constructor(props) {
        super(props);
    }

    container = {
        height: 10,
        width: "100%",
        backgroundColor: "#e0e0de",
        borderRadius: 50,
        margin: 50
    };

    render() {
        return (
            <div className={`MainProgressBar ${this.props.className}`}
                 style={this.container}
                 onClick={this.props.onClick}
            >
                <div style={{
                    height: "100%",
                    width: `${this.props.progress}%`,
                    backgroundColor: this.props.color,
                    borderRadius: "inherit",
                    textAlign: "right"
                }} onClick={this.props.onClick}/>
            </div>
        );
    }
}

export default ProgressBar;