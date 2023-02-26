import React, { ChangeEvent } from "react";

import BasicModal from "@components/common/BasicModal";
import BasicButton from "@components/common/BasicButton";
import BasicToggle from "@components/common/BasicToggle";

import emitter from "@backend/events";
import { Gateway } from "@app/constants";
import { navigate } from "@backend/navigation";
import { getToken, login } from "@backend/user";
import * as settings from "@backend/settings";

import "@css/components/Login.scss";

interface IState {
    save: boolean;
    waiting: boolean;
    loginCode: string;

    window: Window;
    interval: number;
}

class Login extends React.PureComponent<{}, IState> {
    /**
     * Login callback method.
     */
    cleanup = () => {
        // Check if the token should be saved.
        if (!this.state.save) {
            setTimeout(() => {
                settings.setToken("", false);
                settings.remove("user_token");
                settings.remove("authenticated");
            }, 1e3);
        }

        // Update the state.
        this.setState({
            save: true,
            waiting: false,
            loginCode: "",
            window: null,
            interval: 0
        });

        // Navigate home.
        navigate("Home");
    };

    /**
     * Listens for a successful login.
     */
    listenForLogin = () => {
        // Check if the localstorage has been updated.
        if (localStorage.getItem("authenticated") == null)
            return;

        // Validate the code.
        const code = localStorage.getItem("user_token");
        if (code == null || code == "")
            return;

        // Perform a login.
        login().then(() => {
            settings.setToken(code);
            settings.save("authenticated", "discord");
        }).catch((err) => console.warn(err));

        // If it has, stop listening.
        clearInterval(this.state.interval);
        // Close the window.
        this.state.window.close();

        // Perform a cleanup.
        this.cleanup();
    };

    constructor(props: {}) {
        super(props);

        this.state = {
            save: true,
            waiting: false,
            loginCode: "",
            window: null,
            interval: 0
        };
    }

    /**
     * Prompts the user to login via a browser.
     */
    login(): void {
        // Check if the user is waiting.
        if (this.state.waiting) return;

        if (this.state.loginCode.length > 0) {
            // Request a token using the login code.
            getToken(this.state.loginCode)
                .then(() => login())
                .catch((err) => console.warn(err));
        } else {
            // Open the login URL in a new tab.
            this.setState({
                waiting: true,
                window: window.open(`${Gateway.getUrl()}/discord`, "_blank"),
                interval: setInterval(this.listenForLogin, 3e3) as unknown as number
            });
        }
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
        BasicModal.showModal("login");
    }

    componentWillUnmount() {
        emitter.off("login", this.cleanup);
    }

    /**
     * Handles the login code input.
     * @param event The change event.
     */
    changeLoginCode(event: ChangeEvent): void {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        // Check if the value is a number.
        if (isNaN(Number(value))) {
            target.value = this.state.loginCode;
            return;
        }

        this.setState({ loginCode: value });
    }

    render() {
        const loginText =
            this.state.loginCode.length > 0
                ? "Submit Code"
                : "Log In with Discord";

        return (
            <BasicModal id={"login"} className={"Login"}>
                <a className={"Login_Title"}>Log In to Continue</a>

                <div>
                    <input
                        className={"Login_Code"}
                        type={"text"}
                        maxLength={6}
                        placeholder={"6-Digit Code"}
                        onChange={(e) => this.changeLoginCode(e)}
                    />
                </div>

                <div style={{ paddingTop: 12 }}>
                    <BasicButton
                        className={"Login_Button"}
                        text={loginText}
                        onClick={() => this.login()}
                    />
                </div>

                <div style={{ paddingTop: 12 }}>
                    <BasicButton
                        className={"Login_Guest"}
                        text={"Continue as Guest"}
                        onClick={() => this.guest()}
                    />
                </div>

                <div className={"Login_Remember"}>
                    <p>Remember me</p>
                    <BasicToggle
                        default={true}
                        update={(value) => this.setState({ save: value })}
                    />
                </div>

                <div style={{ paddingTop: 12 }}>
                    <p className={"Login_Reason"}>
                        Logging in with Discord lets you create playlists, like
                        songs, connect with your friends and more!
                    </p>
                </div>
            </BasicModal>
        );
    }
}

export default Login;
