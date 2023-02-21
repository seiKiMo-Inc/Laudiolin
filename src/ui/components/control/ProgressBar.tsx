import React from "react";

import Slider from "rc-slider";

import { formatDuration } from "@app/utils";

interface IProps {
    progress: number;
    duration: number;

    onSeek: (progress: number) => void;
}

interface IState {
    activeThumb: boolean;
    progress: number;
}

class ProgressBar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            activeThumb: false,
            progress: props.progress
        };
    }

    setProgress(progress: number): void {
        this.setState({ progress });
    }

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.progress != this.props.progress) {
            this.setState({ progress: this.props.progress });
        }
    }

    render() {
        return (
            <div
                className={"ControlPanel_ProgressBar"}
                onMouseEnter={() => this.setState({ activeThumb: true })}
                onMouseLeave={() => this.setState({ activeThumb: false })}
            >
                <p className={"ControlPanel_ProgressBar_Time"}>{formatDuration(this.props.progress)}</p>
                <Slider
                    min={0}
                    max={this.props.duration}
                    value={this.state.progress}
                    onChange={(progress: number) => this.setProgress(progress)}
                    onAfterChange={(progress: number) => this.props.onSeek(progress)}
                    trackStyle={{ backgroundColor: "var(--accent-color)" }}
                    handleStyle={{
                        display: this.state.activeThumb ? "block" : "none",
                        borderColor: "var(--accent-color)",
                        backgroundColor: "white"
                    }}
                    railStyle={{ backgroundColor: "var(--background-secondary-color)" }}
                    draggableTrack={true}
                />
                <p className={"ControlPanel_ProgressBar_Time"}>{formatDuration(this.props.duration)}</p>
            </div>
        );
    }
}

export default ProgressBar;
