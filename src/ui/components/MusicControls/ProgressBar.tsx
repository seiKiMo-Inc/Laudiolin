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

    render() {
        return (
            <ProgressBar
                className="rounded progress-bar dark:bg-gray-700 bg-slate-100 relative"
                onClick={(e) =>
                    this.props.setProgress(
                        (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) *
                        this.props.duration
                    )
                }
                animated
                now={(this.props.progress / this.props.duration) * 100}
                label={
                    this.props.duration > 0
                        ? `${Math.round(this.props.progress)}/${Math.round(this.props.duration)}`
                        : ""
                }
                style={{
                    height: "10px"
                }}
            />
        );
    }
}

export default ProgressBarComponent;