import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

interface IProps {
    progress: number;
    duration: number;
    setProgress: (value: number) => void;
}

class ProgressBarComponent extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }
    formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const secondsLeft = Math.floor(seconds % 60);
        return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
    }
    render() {
        return (
            <>
                <span>
                    {this.props.duration > 0
                        ? `${this.formatTime(
                            Math.round(this.props.progress)
                        )}/${this.formatTime(
                            Math.round(this.props.duration)
                        )}`
                        : "0:00/0:00"}
                </span>
                <ProgressBar
                    className="rounded progress-bar dark:bg-gray-700 bg-slate-100 relative"
                    onClick={(e) =>
                        this.props.setProgress(
                            (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) *
                            this.props.duration
                        )
                    }
                    animated
                    label={`${Math.round((this.props.progress / this.props.duration) * 100)}%` || ""}
                    now={(this.props.progress / this.props.duration) * 100 || 0}
                    style={{
                        height: "10px"
                    }}
                />
            </>



        );
    }
}

export default ProgressBarComponent;