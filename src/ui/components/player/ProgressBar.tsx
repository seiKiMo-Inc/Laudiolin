import React from "react";

import ProgressBar from "@components/common/ProgressBar";

import "@css/ProgressBar.css";

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
        if (duration <= 0) return "--:--";

        let minutes: number = Math.floor(duration / 60);
        let seconds: any = (duration % 60).toFixed(0);

        return seconds == 60 ? minutes + 1 + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    };

    render() {
        const progress = this.props.duration > 0 ? (this.props.progress / this.props.duration) * 100 : 0;

        return (
            <span id="ProgressBar">
                <p id="timestamp-start">{this.msToMinutes(this.props.progress)}</p>
                <ProgressBar
                    color={"#3484fc"}
                    className="dark:bg-gray-700 bg-slate-100 relative"
                    progress={progress}
                    onClick={(e) =>
                        this.props.setProgress(
                            (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * this.props.duration
                        )
                    }
                />

                <p id="timestamp-end">{this.msToMinutes(this.props.duration)}</p>
            </span>
        );
    }
}

export default ProgressBarComponent;
