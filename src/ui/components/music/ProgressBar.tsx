import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import "src/css/ProgressBar.css";

interface IProps {
    progress: number;
    duration: number;
    setProgress: (value: number) => void;
}

class ProgressBarComponent extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    msToMinutes = (duration: number) => {
        let minutes: number = Math.floor(duration / 60000);
        let seconds: any = ((duration % 60000) / 1000).toFixed(0);

        return (
            seconds == 60 ?
                (minutes + 1) + ":00" :
                minutes + ":" + (seconds < 10 ? "0" : "") + seconds
        );
    };

    render() {
        return (
            <span id="ProgressBar">
                <p id="timestamp-start">{this.msToMinutes(this.props.duration)}</p>
                <ProgressBar
                    className="MainProgressBar rounded progress-bar dark:bg-gray-700 bg-slate-100 relative"
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
                />
                <p id="timestamp-end">{this.msToMinutes(this.props.duration)}</p>
            </span>
        );
    }
}

export default ProgressBarComponent;