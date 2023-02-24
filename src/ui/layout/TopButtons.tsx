import React from "react";

import { appWindow } from "@tauri-apps/api/window";
import {
    VscClose,
    VscChromeMinimize,
    VscChromeMaximize
} from "react-icons/vsc";

import "@css/layout/TopButtons.scss";

class TopButtons extends React.Component {
    closeWindow = async () => {
        await appWindow.close();
    };

    minimizeWindow = async () => {
        await appWindow.minimize();
    };

    maximizeWindow = async () => {
        if (await appWindow.isMaximized()) {
            await appWindow.unmaximize();
        } else {
            await appWindow.maximize();
        }
    };

    render() {
        return (
            <div
                className={"TopButtonsContainer"}
                data-tauri-drag-region={true}
            >
                <VscClose className={"TopButtons"} onClick={this.closeWindow} />
                <VscChromeMaximize
                    className={"TopButtons"}
                    onClick={this.maximizeWindow}
                />
                <VscChromeMinimize
                    className={"TopButtons"}
                    onClick={this.minimizeWindow}
                />
            </div>
        );
    }
}

export default TopButtons;
