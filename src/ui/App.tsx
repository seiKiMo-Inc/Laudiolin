import React from "react";

import ControlPanel from "@layout/ControlPanel";
import NavPanel from "@layout/NavPanel";
import MainView from "@layout/MainView";
import ActivityPanel from "@layout/ActivityPanel";
import TopBar from "@layout/TopBar";

import Alert from "@components/Alert";

import emitter from "@backend/events";
import { openFromUrl } from "@backend/link";
import { loadPlayerState } from "@app/utils";
import { login, userData } from "@backend/user";

import "@css/App.scss";
import "@css/Text.scss";

interface IState {
    miniPlayer: boolean;
}

class App extends React.Component<{}, IState> {
    /**
     * Login/Logout callback method.
     */
    reloadUser = () => {
        this.forceUpdate();
    };

    constructor(props: {}) {
        super(props);

        this.state = {
            miniPlayer: false
        };
    }

    /**
     * Close all dropdowns when the user clicks outside them.
     * @param e - The mouse event.
     */
    closeDropdowns = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const dropdowns = document.getElementsByClassName("DropdownContent");

        let isSVG = false;

        // check if target's children are svg or path elements.
        if (target.children.length > 0) {
            for (let i = 0; i < target.children.length; i++) {
                const child = target.children[i] as HTMLElement;
                if (child.tagName === "svg" || child.tagName === "path") {
                    return (isSVG = true);
                }
            }
        }

        if (!target.classList.contains("dropbtn") || isSVG) {
            const currentUserChevron = document.getElementsByClassName(
                "CurrentUser_Chevron"
            )[0] as HTMLElement;
            currentUserChevron &&
            currentUserChevron.style.transform == "rotate(180deg)"
                ? (currentUserChevron.style.transform = "rotate(0deg)")
                : null;

            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i] as HTMLElement;
                if (openDropdown.classList.contains("show")) {
                    openDropdown.classList.remove("show");
                }
            }
        }
    };

    componentDidMount() {
        // Attempt to log in.
        login()
            .then(() => openFromUrl())
            .catch((err) => console.warn(err));

        // Register event listeners.
        emitter.on("login", this.reloadUser);
        emitter.on("logout", this.reloadUser);
        // Register document event listeners.
        document.onclick = this.closeDropdowns;
        document.oncontextmenu = this.closeDropdowns;

        // Load the player's last known state.
        loadPlayerState().catch((err) => console.warn(err));
    }

    componentWillUnmount() {
        // Unregister event listeners.
        emitter.off("login", this.reloadUser);
        emitter.off("logout", this.reloadUser);
        document.onclick = null;
    }

    render() {
        return (
            <>
                <div className={"AppContainer"}>
                    <NavPanel user={userData} />
                    <TopBar />
                    <MainView />
                    <ActivityPanel />
                    <ControlPanel />
                </div>
                <Alert />
            </>
        );
    }
}

export default App;
