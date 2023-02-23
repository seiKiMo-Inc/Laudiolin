import React from "react";

import TopButtons from "@layout/TopButtons";
import ControlPanel from "@layout/ControlPanel";
import NavPanel from "@layout/NavPanel";
import MainView from "@layout/MainView";
import ActivityPanel from "@layout/ActivityPanel";
import TopBar from "@layout/TopBar";
import Alert from "@components/Alert";

import { invoke } from "@tauri-apps/api";

import emitter from "@backend/events";
import { loadState } from "@backend/offline";
import { openFromUrl } from "@backend/link";
import { loadPlayerState } from "@app/utils";
import { login, userData, loaders } from "@backend/user";

import "@css/App.scss";
import "@css/Text.scss";

class App extends React.Component<any> {
    /**
     * Login/Logout callback method.
     */
    reloadUser = () => {
        this.forceUpdate();
    };

    constructor(props: any) {
        super(props);
    }

    /**
     * Checks if the user is online.
     */
    checkIfOnline(): void {
        invoke("online")
            .then((online: boolean) => {
                if (online) {
                    // Attempt to log in.
                    login()
                        .then(() => openFromUrl())
                        .catch(err => console.warn(err))
                } else {
                    // Attempt to load offline user data.
                    // Load the offline state.
                    setTimeout(() => loadState(
                        loaders.userData,
                        loaders.playlists,
                        loaders.favorites,
                    ).catch(err => console.warn(err)), 1e3);
                }
            })
            .catch(err => console.warn(err));
    }

    // Add event listener to close all active dropdowns when clicking outside of them.
    closeDropdowns = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const dropdowns = document.getElementsByClassName("DropdownContent");

        let isSVG = false;

        // check if target's children are svg or path elements.
        if (target.children.length > 0) {
            for (let i = 0; i < target.children.length; i++) {
                const child = target.children[i] as HTMLElement;
                if (child.tagName === "svg" || child.tagName === "path") {
                    return isSVG = true;
                }
            }
        }

        if (!target.classList.contains("dropbtn") || isSVG) {
            const currentUserChevron = document.getElementsByClassName("CurrentUser_Chevron")[0] as HTMLElement;
            currentUserChevron.style.transform === "rotate(180deg)" ?
                currentUserChevron.style.transform = "rotate(0deg)" :
                null;
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i] as HTMLElement;
                if (openDropdown.classList.contains("show")) {
                    openDropdown.classList.remove("show");
                }
            }
        }
    }

    componentDidMount() {
        // Register event listeners.
        emitter.on("login", this.reloadUser);
        emitter.on("logout", this.reloadUser);

        // Check if the user is online.
        this.checkIfOnline();
        // Load the player's last known state.
        loadPlayerState()
            .catch(err => console.warn(err));

        // Add event listener to close all active dropdowns when clicking outside of them.
        document.onclick = this.closeDropdowns;
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
                <TopButtons />
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
