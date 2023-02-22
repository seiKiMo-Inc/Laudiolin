import React from "react";

import TopButtons from "@layout/TopButtons";
import ControlPanel from "@layout/ControlPanel";
import NavPanel from "@layout/NavPanel";
import MainView from "@layout/MainView";
import ActivityPanel from "@layout/ActivityPanel";
import TopBar from "@layout/TopBar";

import { invoke } from "@tauri-apps/api";

import emitter from "@backend/events";
import { loadState } from "@backend/offline";
import { login, userData, loaders } from "@backend/user";

import "@css/App.scss";
import "@css/Text.scss";

interface IProps {

}

interface IState {

}

class App extends React.Component<IProps, IState> {
    /**
     * Login/Logout callback method.
     */
    reloadUser = () => {
        this.forceUpdate();
    };

    constructor(props: IProps) {
        super(props);

        this.state = {

        };
    }

    /**
     * Checks if the user is online.
     */
    checkIfOnline(): void {
        invoke("online")
            .then((online: boolean) => {
                if (online) {
                    // Attempt to log in.
                    login().catch(err => console.warn(err))
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

    componentDidMount() {
        // Register event listeners.
        emitter.on("login", this.reloadUser);
        emitter.on("logout", this.reloadUser);

        // Check if the user is online.
        this.checkIfOnline();
    }

    componentWillUnmount() {
        // Unregister event listeners.
        emitter.off("login", this.reloadUser);
        emitter.off("logout", this.reloadUser);
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
            </>
        );
    }
}

export default App;
