import React from "react";

import BasicModal from "@components/common/BasicModal";
import BasicButton from "@components/common/BasicButton";
import BasicToggle from "@components/common/BasicToggle";

import { invoke } from "@tauri-apps/api";

import emitter from "@backend/events";
import { Gateway } from "@app/constants";
import * as settings from "@backend/settings";
import { router } from "@app/main";
import { contentRoutes } from "@app/constants";

import "@css/components/Login.scss";

interface IState {
    save: boolean;
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
            save: true
        });

        // Navigate home.
        router.navigate(contentRoutes.HOME);
    };

    constructor(props: {}) {
        super(props);

        this.state = {
            save: true
        };
    }

    /**
     * Prompts the user to login via a browser.
     */
    login(): void {
        // Open the login URL in a browser.
        invoke("open", { url: `${Gateway.getUrl()}/login` })
            .catch(console.warn);
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

    render() {
        return (
            <BasicModal id={"login"} className={"Login"}>
                <a className={"Login_Title"}>Log In to Continue</a>

                <div style={{ paddingTop: 12 }}>
                    <BasicButton
                        className={"Login_Button"}
                        text={"Log In with seiKiMo"}
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
