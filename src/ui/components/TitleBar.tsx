import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faCircle,
    faHome,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Pages } from "@app/constants";

interface IProps {}

interface IState {
    isMaximized: boolean;
    isBackEnabled: boolean;
    isNextEnabled: boolean;
}

class TitleBar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isMaximized: false,
            isBackEnabled: false,
            isNextEnabled: false
        };
    }

    minimize = async () => {
        await appWindow.minimize();
    };

    maximize = async () => {
        await appWindow.maximize();
        this.setState({ isMaximized: true });
    };

    unmaximize = async () => {
        await appWindow.unmaximize();
        this.setState({ isMaximized: false });
    };

    close = async () => {
        await appWindow.close();
    };

    back = () => {
        window.history.back();
    };

    next = () => {
        window.history.forward();
    };

    render() {
        return (
            <div className="titlebar" data-tauri-drag-region={true}>
                <div className="titlebar-button mr-0 text-white" id="titlebar-back" onClick={this.back} title="Back">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <Link to={Pages.home}>
                    <div className="titlebar-button mr-0 text-white" id="titlebar-home" title="Home">
                        <FontAwesomeIcon icon={faHome} />
                    </div>
                </Link>
                <div className="titlebar-button mr-auto text-white" id="titlebar-next" onClick={this.next} title="Next">
                    <FontAwesomeIcon icon={faArrowRight} />
                </div>
                <div
                    className="titlebar-button text-green-500"
                    id="titlebar-minimize"
                    onClick={this.minimize}
                    title="Minimize"
                >
                    <FontAwesomeIcon icon={faCircle} />
                </div>
                <div
                    className="titlebar-button text-yellow-500"
                    id="titlebar-maximize"
                    onClick={this.state.isMaximized ? this.unmaximize : this.maximize}
                    title="Maximize"
                >
                    <FontAwesomeIcon icon={faCircle} />
                </div>
                <div className="titlebar-button text-red-500" id="titlebar-close" onClick={this.close} title="Close">
                    <FontAwesomeIcon icon={faCircle} />
                </div>
            </div>
        );
    }
}

export default TitleBar;
