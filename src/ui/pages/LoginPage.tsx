import React from "react";
import { Link } from "react-router-dom";

import { login } from "@backend/user";

import { Pages } from "@app/constants";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { getSettings, saveSettings } from "@backend/settings";

import Navigator from "@components/common/Navigator";

import Button from "@components/common/Button";
import AnimatePages from "@components/common/AnimatePages";
import { IconDefinition, IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";

import "@css/Login.scss";

const faDiscord: IconDefinition = {
    icon: [64, 64, [], "",
        // discord logo svg
        "M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
    ],
    iconName: "discord-icon" as IconName,
    prefix: "fa" as IconPrefix
};

interface IProps {
    navigate: (path: string) => void;
}
interface IState {
    waiting: boolean;
}

class LoginPage extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            waiting: false
        };
    }

    loginToDiscord = async () => {
        if (this.state.waiting) return;
        this.setState({ waiting: true });

        // Perform handoff process.
        await invoke("handoff");
        await invoke("open_browser");

        // Wait for an authorization code.
        await listen("set_code", event => {
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("isGuest", "false");

            // Get the authorization code.
            const {code} = event.payload as any;
            // Save the authorization code.
            const settings = getSettings();
            settings.token = code;
            saveSettings(settings);

            // Redirect to the home page.
            this.props.navigate(Pages.home);
            this.setState({ waiting: false });

            login();
        });
    };

    loginAsGuest = () => {
        localStorage.setItem("isAuthenticated", "false");
        localStorage.setItem("isGuest", "true");
    };

    componentDidMount() {
        const navbar = document.getElementsByClassName("navbar")[0] as HTMLElement;
        navbar.style.display = "none";
        const controls = document.getElementsByClassName("controls")[0] as HTMLElement;
        controls.style.display = "none";
    }

    componentWillUnmount() {
        const navbar = document.getElementsByClassName("navbar")[0] as HTMLElement;
        navbar.style.display = "block";
        const controls = document.getElementsByClassName("controls")[0] as HTMLElement;
        controls.style.display = "block";
    }

    render() {
        return (
            <AnimatePages>
                <div className="LoginPage">
                    <Button className="LoginButton" onClick={this.loginToDiscord} icon={faDiscord}>
                        Login With Discord
                    </Button>
                    <p className="LoginGuestText">
                        Or continue as{" "}
                        <Link
                            to={Pages.home}
                            className="LoginGuest"
                            onClick={this.loginAsGuest}
                        >
                            Guest
                        </Link>
                        .
                    </p>
                    <p className="LoginText">
                        Logging in with discord lets you make playlists, like songs, connect with friends, have rich
                        presence on Discord and more...
                    </p>
                </div>
            </AnimatePages>
        );
    }
}

export default Navigator(LoginPage);
