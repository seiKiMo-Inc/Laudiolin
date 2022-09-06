import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

interface IProps {
    progress: number;
    duration: number;
    setProgress: (value: number) => void;
}

const ProgressBarComponent: React.FC<IProps> = (props) => {
    return (
        <ProgressBar
            className="rounded progress-bar dark:bg-gray-700 relative"
            onClick={(e) =>
                props.setProgress(
                    (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) *
                    props.duration
                )
            }
            animated
            now={(props.progress / props.duration) * 100}
            label={
                props.duration > 0
                    ? `${Math.round(props.progress)}/${Math.round(props.duration)}`
                    : ""
            }
            style={{
                height: "10px"
            }}
        />
    );
};

export default ProgressBarComponent;