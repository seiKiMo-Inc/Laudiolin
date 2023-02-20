import React from "react";

import { invoke } from "@tauri-apps/api";

import emitter from "@backend/events";
import { Gateway } from "@app/constants";
import { navigate } from "@backend/navigation";
import * as settings from "@backend/settings";

import "@css/pages/Login.scss";

interface IState {
    waiting: boolean;
    withCode: boolean;
}

class Home extends React.Component<{}, IState> {
    /**
     * Login callback method.
     */
    cleanup = () => {
        // Update the state.
        this.setState({
            waiting: false,
            withCode: false,
        });

        // Navigate home.
        navigate("Home");
    };

    constructor(props: {}) {
        super(props);

        this.state = {
            waiting: false,
            withCode: false
        };
    }

    /**
     * Prompts the user to login via a browser.
     */
    login(): void {
        // Check if the user is waiting.
        if (this.state.waiting) return;

        // Open the login URL in a browser.
        invoke("open", { url: `${Gateway.url}/discord` })
            .then(() => this.setState({ waiting: true }))
            .catch(err => console.warn(err));
    }

    /**
     * Allows the user to continue as a guest.
     */
    guest(): void {
        settings.save("authenticated", "guest");
        this.cleanup();
    }

    componentDidMount() {
        emitter.on("login", this.cleanup);
    }

    componentWillUnmount() {
        emitter.off("login", this.cleanup);
    }

    render() {
        return (
            <div>
                <button
                    onClick={() => this.login()}
                >
                    Login with Discord
                </button>

                <button
                    onClick={() => this.guest()}
                >
                    Continue as Guest
                </button>
            </div>
        );
    }
}

export default Home;
