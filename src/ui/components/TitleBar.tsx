import React from "react";
import { appWindow } from '@tauri-apps/api/window';

interface IProps { }

interface IState {
    isMaximized: boolean;
}

class TitleBar extends React.Component<IProps, IState> {  
    constructor(props: IProps) {
        super(props);
        this.state = {
            isMaximized: false,
        }
    }

    minimize = () => {
        appWindow.minimize();
    }

    maximize = () => {
        appWindow.maximize();
        this.setState({ isMaximized: true });
    }

    unmaximize = () => {
        appWindow.unmaximize();
        this.setState({ isMaximized: false });
    }

    close = () => {
        appWindow.close();
    }

    render() {
        return (
            <div className="titlebar" data-tauri-drag-region>
                <div className="titlebar-button" id="titlebar-minimize" onClick={this.minimize}>
                    <img
                        src="https://api.iconify.design/mdi:window-minimize.svg"
                        alt="minimize"
                        style={{ filter: "invert(100%)" }}
                    />
                </div>
                <div className="titlebar-button" id="titlebar-maximize" onClick={this.state.isMaximized ? this.unmaximize : this.maximize}>
                    <img
                        src="https://api.iconify.design/mdi:window-maximize.svg"
                        alt="maximize"
                        style={{ filter: "invert(100%)" }}
                    />
                </div>
                <div className="titlebar-button" id="titlebar-close" onClick={this.close}>
                    <img 
                        src="https://api.iconify.design/mdi:close.svg" 
                        alt="close" 
                        style={{ filter: "invert(100%)" }} />
                </div>
            </div>
        );
    }
}

export default TitleBar;