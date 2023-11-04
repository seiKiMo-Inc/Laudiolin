import React from "react";

import TopButtons from "@layout/TopButtons";
import ControlPanel from "@layout/ControlPanel";
import NavPanel from "@layout/NavPanel";
import MainView from "@layout/MainView";
import ActivityPanel from "@layout/ActivityPanel";
import TopBar from "@layout/TopBar";

import Alert from "@components/Alert";
import MiniPlayer from "@components/player/MiniPlayer";

import { invoke } from "@tauri-apps/api";
import { appWindow, LogicalSize } from "@tauri-apps/api/window";

import emitter from "@backend/events";
import { loadState } from "@backend/desktop/offline";
import { openFromUrl } from "@backend/desktop/link";
import { loadPlayerState, fadeOut } from "@app/utils";
import { login, userData, loaders, playlists } from "@backend/social/user";
import { get } from "@backend/settings";
import { router } from "@app/main";
import { contentRoutes } from "@app/constants";

import "@css/App.scss";
import "@css/Text.scss";
import "react-tooltip/dist/react-tooltip.css";

interface IState {
    miniPlayer: boolean;
}

class App extends React.Component<{}, IState> {
    /**
     * Login/Logout callback method.
     */
    reloadUser = () => {
        this.forceUpdate();
        this.fadeLaunchScreen();
    };

    /**
     * Sets the mini player state.
     * @param enter Should the mini player enter or exit?
     */
    miniPlayer = (enter: boolean) => {
        this.setState({ miniPlayer: enter });
        appWindow.setSize(enter ?
            new LogicalSize(427, 240) :
            new LogicalSize(1200, 600));
        appWindow.setResizable(!enter);

        // If exiting, reload user data.
        if (!enter) {
            setTimeout(() => {
                emitter.emit("playlist", playlists);
            }, 1e3);
        }
    };

    constructor(props: {}) {
        super(props);

        this.state = {
            miniPlayer: false
        };
    }

    /**
     * Checks if the window is in mini player mode.
     * Resizes the window if it is.
     */
    async checkMiniPlayerState(): Promise<void> {
        const size = await appWindow.innerSize();
        if (size.width == 427 && size.height == 240)
            this.miniPlayer(false);
    }

    /**
     * Checks if the user is online.
     */
    checkIfOnline(): void {
        // #v-ifdef VITE_BUILD_ENV=desktop
        const loadOffline = () =>
            loadState(
                loaders.userData,
                loaders.playlists,
                loaders.favorites
            ).catch((err) => console.warn(err));

        invoke("online")
            .then((online: boolean) => {
                if (online) {
                    // Attempt to log in.
                    login()
                        .then(() => openFromUrl())
                        .catch(() => loadOffline());
                } else {
                    // Attempt to load offline user data.
                    // Load the offline state.
                    setTimeout(loadOffline, 1e3);
                }
            })
            .catch((err) => console.warn(err));
        // #v-else
        login()
            .then(() => openFromUrl())
            .catch(() => console.error("Failed to login."));
        // #v-endif
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

    fadeLaunchScreen = (): void => {
        setTimeout(() => {
            const placeholderBG = document.getElementById("placeholderBG");
            const loader = document.getElementsByClassName("loader")[0] as HTMLElement;

            fadeOut(placeholderBG, 200);
            fadeOut(loader, 200);
        }, 1e3);
    }

    componentDidMount() {
        // Check if the window is in mini player mode.
        this.checkMiniPlayerState();

        // Check if user is logged in.
        if (!get("authenticated") || get("authenticated") !== ("discord" || "guest"))
            router.navigate(contentRoutes.LOGIN);

        // Register event listeners.
        emitter.on("login", this.reloadUser);
        emitter.on("logout", this.reloadUser);
        emitter.on("miniPlayer", this.miniPlayer);
        // Register document event listeners.
        document.onclick = this.closeDropdowns;
        document.oncontextmenu = this.closeDropdowns;

        // Check if the user is online.
        this.checkIfOnline();
        // Load the player's last known state.
        loadPlayerState().catch((err) => console.warn(err));

        // Fade launch screen.
        if (get("authenticated") !== "discord") this.fadeLaunchScreen();
    }

    componentWillUnmount() {
        // Unregister event listeners.
        emitter.off("login", this.reloadUser);
        emitter.off("logout", this.reloadUser);
        emitter.off("miniPlayer", this.miniPlayer);
        document.onclick = null;
    }

    render() {
        return !this.state.miniPlayer ? (
            <main onContextMenu={(e) => e.preventDefault()}>
// #v-ifdef VITE_BUILD_ENV=desktop
                <TopButtons />
// #v-endif

                <div className={"AppContainer"}>
                    <NavPanel user={userData} />
                    <TopBar />
                    <MainView />
                    <ActivityPanel />
                    <ControlPanel />
                </div>
                <Alert />
            </main>
        ) : <MiniPlayer />;
    }
}
export default App;
