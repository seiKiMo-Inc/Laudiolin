import React from "react";

import { formatDuration } from "@app/utils";

interface IProps {
    progress: number;
    duration: number;
    onSeek: (progress: number) => void;
}

interface IState {
    dragProgress: number;
}

class ProgressBar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            dragProgress: props.progress ?? 0
        }
    }

    getProgressPercentage(): number {
        return this.state.dragProgress / this.props.duration * 100;
    }

    seek(e: React.MouseEvent<HTMLDivElement>): void {
        this.props.onSeek((e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * this.props.duration);
        console.log("seeking");
    }

    progressDrag(e: React.MouseEvent<HTMLDivElement>): void {
        this.setState({ dragProgress: (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * this.props.duration });
    }

    componentDidUpdate(prevProps: Readonly<IProps>) {
        if (this.props.progress !== prevProps.progress) {
            this.setState({ dragProgress: this.props.progress });
        }
    }

    render() {
        return (
            <div className={"ControlPanel_ProgressBar"}>
                <p className={"ControlPanel_ProgressBar_Time"}>
                    {formatDuration(this.props.progress)}
                </p>

                <div
                    className={"ControlPanel_ProgressBar_Track"}
                    draggable={true}
                    onClick={(e) => this.seek(e)}
                    onDragStart={(e) => this.progressDrag(e)}
                    onDragOver={(e) => this.progressDrag(e)}
                    onDragEnd={(e) => this.seek(e)}
                >
                    <div className={"ControlPanel_ProgressBar_Fill"} style={{ width: this.getProgressPercentage() + "%" }} />
                </div>

                <p className={"ControlPanel_ProgressBar_Time"}>
                    {formatDuration(this.props.duration)}
                </p>
            </div>
        );
    }
}

export default ProgressBar;
