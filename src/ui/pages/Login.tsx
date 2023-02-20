import React from "react";

import { invoke } from "@tauri-apps/api";

import BasicButton from "@components/common/BasicButton";

import emitter from "@backend/events";
import { Gateway } from "@app/constants";
import { navigate } from "@backend/navigation";
import * as settings from "@backend/settings";

import "@css/pages/Login.scss";

import { ImConfused } from "react-icons/all";

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
        const loginText = this.state.withCode ? "Submit Code" : "Log In with Discord";

        return (
            <div className={"Login"}>
                <a className={"Login_Title"}>Log In to Continue</a>

                <div style={{ paddingTop: 35 }}>
                    <input
                        className={"Login_Code"}
                        type={"text"} maxLength={6}
                        placeholder={"6-Digit Code"}
                        onChange={e => this.setState({ withCode: true })}
                    />
                </div>

                <div style={{ paddingTop: 16 }}>
                    <BasicButton
                        className={"Login_Button"}
                        text={loginText}
                    />
                </div>

                <div style={{ paddingTop: 24 }}>
                    <BasicButton
                        className={"Login_Guest"}
                        text={"Continue as Guest"}
                    />
                </div>

                <div className={"Login_Remember"}>
                    <p>Remember me</p>
                    <ImConfused />
                </div>

                <div style={{ paddingTop: 24 }}>
                    <p className={"Login_Reason"}>
                        Logging in with Discord lets you create playlists, like songs, connect with your friends and more!
                    </p>
                </div>
            </div>
        );
    }
}

export default Home;
