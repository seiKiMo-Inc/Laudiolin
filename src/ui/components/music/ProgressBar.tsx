import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

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
        if(duration == -1) return "--:--";

        let minutes: number = Math.floor(duration / 60);
        let seconds: any = (duration % 60).toFixed(0);

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
                    // rounded progress-bar dark:bg-gray-700 bg-slate-100 relative
                    className="MainProgressBar rounded progress-bar dark:bg-gray-700 bg-slate-100 relative"
                    // onClick={(e) =>
                    //     this.props.setProgress(
                    //         (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) *
                    //         this.props.duration
                    //     )
                    // }
                    now={60}
                />

                <p id="timestamp-end">{this.msToMinutes(this.props.duration)}</p>
            </span>
        );
    }
}

export default ProgressBarComponent;