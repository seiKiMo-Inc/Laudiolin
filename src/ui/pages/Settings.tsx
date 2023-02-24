import React from "react";

import Switch from "react-switch";
import { BiChevronDown } from "react-icons/bi";

import BasicDropdown, {
    toggleDropdown
} from "@components/common/BasicDropdown";
import BasicButton from "@components/common/BasicButton";

import type { SettingType } from "@backend/types";
import { offlineSupport } from "@backend/offline";
import { connect } from "@backend/gateway";
import { getCode } from "@backend/user";
import * as settings from "@backend/settings";

import "@css/pages/Settings.scss";
import BasicModal from "@components/common/BasicModal";

interface ISetting {
    setting: string;
    description?: string;

    type?: SettingType;
    placeholder?: string | number | boolean;
    options?: string[];
    update?: (value: any) => void;
    color?: string;
}

function Setting(props: ISetting) {
    const properties = {
        ...props,
        placeholder: settings.getFromPath(props.setting, ""),
        set: (value: any) => {
            settings.saveFromPath(props.setting, value);
            props.update?.(value);
        }
    };

    return (
        <div className={"Setting"}>
            <div className={"Setting_Text"}>
                <p>{settings.settingsKeys[props.setting] ?? "Unknown"}</p>
                {props.description &&
                    props.description
                        .split("\n")
                        .map((desc, index) => <p key={index}>{desc}</p>)}
            </div>

            <div>
                {props.type == "input" && <InputField props={properties} />}
                {props.type == "select" && <SelectField props={properties} />}
                {props.type == "boolean" && <ToggleField props={properties} />}
            </div>
        </div>
    );
}

function InputField({ props }) {
    return (
        <input
            className={"Setting_Box Setting_Input"}
            type={"text"}
            placeholder={props.placeholder}
            onChange={(event) => props.set(event.target.value)}
        />
    );
}

function SelectField({ props }) {
    const update = (index: number) => {
        toggleDropdown(props.setting);
        setValue(props.options[index]);
        props.set(props.options[index]);
    };

    const [value, setValue] = React.useState<string>(props.placeholder);

    function setDropdownPosition() {
        const button = document.getElementById(props.setting + "_button");
        const dropdown = document.getElementById(props.setting);

        if (!button || !dropdown) return;

        const buttonRect = button.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();

        const top = buttonRect.top + buttonRect.height;
        const left = buttonRect.left;

        if (top + dropdownRect.height > window.innerHeight) {
            dropdown.style.top = buttonRect.top - dropdownRect.height + "px";
        } else {
            dropdown.style.top = top + "px";
        }

        dropdown.style.left = left + "px";
    }

    return (
        <>
            <BasicButton
                className={"Setting_Box dropbtn"}
                id={props.setting + "_button"}
                text={value}
                icon={<BiChevronDown />}
                onClick={() => {
                    setDropdownPosition();
                    toggleDropdown(props.setting);
                }}
            />

            <BasicDropdown id={props.setting} className={"Settings_Dropdown"}>
                {props.options.map((option, index) => (
                    <a key={index} onClick={() => update(index)}>
                        {option}
                    </a>
                ))}
            </BasicDropdown>
        </>
    );
}

function ToggleField({ props }) {
    const [enabled, setEnabled] = React.useState<boolean>(
        typeof props.placeholder == "string"
            ? props.placeholder == "true"
            : props.placeholder
    );

    return (
        <Switch
            onChange={(state) => {
                setEnabled(state);
                props.set(state.toString());
            }}
            checked={enabled}
            onColor={props.color}
            checkedIcon={false}
            uncheckedIcon={false}
            width={40}
            height={20}
        />
    );
}

interface IDisplayProps {
    text: string;
    description?: string;

    children: React.ReactNode;
}

function DisplayField(props: IDisplayProps) {
    return (
        <div className={"Setting"}>
            <div className={"Setting_Text"}>
                <p>{props.text}</p>
                {props.description && <p>{props.description}</p>}
            </div>

            <div>{props.children}</div>
        </div>
    );
}

interface IState {
    color: string;
    code: string;
}

class Settings extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            color: settings.ui().color_theme == "Light" ? "#ED7D64" : "#3484FC",
            code: ""
        };
    }

    /**
     * Shows the user a 6-digit code to login on other devices.
     */
    async revealLoginCode(): Promise<void> {
        const code = await getCode();
        if (code == null) return;

        this.setState({ code });
        BasicModal.showModal("login_code");
    }

    render() {
        return (
            <div className={"Settings"}>
                <h2 style={{ marginBottom: 20 }}>Settings</h2>

                <Setting
                    setting={"search.engine"}
                    type={"select"}
                    description={"The engine to query track searching."}
                    options={["YouTube", "Spotify", "All"]}
                />

                <h2 style={{ marginTop: 30, marginBottom: 20 }}>Audio</h2>

                <Setting
                    setting={"audio.playback_mode"}
                    type={"select"}
                    description={
                        "Download = Better consistency; higher initial bandwidth\n" +
                        "Stream = Poor seeking performance; lower initial bandwidth"
                    }
                    update={() => this.forceUpdate()}
                    options={["Download", "Stream"]}
                />
                {settings.audio().playback_mode == "Stream" && (
                    <Setting
                        setting={"audio.audio_quality"}
                        type={"select"}
                        description={"The quality of the streamed audio."}
                        options={["Low", "Medium", "High"]}
                    />
                )}
                <Setting
                    setting={"audio.stream_sync"}
                    type={"boolean"}
                    description={
                        "If enabled, audio will be always be streamed when listening along."
                    }
                    color={this.state.color}
                />

                <h2 style={{ marginTop: 30, marginBottom: 20 }}>Interface</h2>

                <Setting
                    setting={"ui.color_theme"}
                    type={"select"}
                    description={"The color palette to use."}
                    options={["Dark", "Light"]}
                    update={(state) => {
                        settings.setTheme(state);
                        this.setState({
                            color: state == "Light" ? "#ED7D64" : "#3484FC"
                        });
                    }}
                />

                <h2 style={{ marginTop: 30, marginBottom: 20 }}>System</h2>

                <DisplayField
                    text={"Get Login Code"}
                    description={
                        "Generates a 6-digit code to login on other devices simultaneously."
                    }
                >
                    <BasicButton
                        text={"Reveal"}
                        className={"Setting_Box Setting_Button"}
                        onClick={() => this.revealLoginCode()}
                    />
                </DisplayField>

                <Setting
                    setting={"system.offline"}
                    type={"boolean"}
                    description={
                        "This will make Laudiolin available while you're offline."
                    }
                    update={(state) => offlineSupport(state == "true")}
                    color={this.state.color}
                />
                <Setting
                    setting={"system.broadcast_listening"}
                    type={"select"}
                    description={"Who should see what you're listening to?"}
                    options={["Everyone", "Friends", "Nobody"]}
                />
                <Setting
                    setting={"system.presence"}
                    type={"select"}
                    description={"What should your Discord presence look like?"}
                    options={["Generic", "Simple", "None"]}
                />

                <h2 style={{ marginTop: 30, marginBottom: 20 }}>Gateway</h2>

                <DisplayField text={"Reconnect to Gateway"}>
                    <BasicButton
                        text={"Reconnect"}
                        className={"Setting_Box Setting_Button"}
                        onClick={() => connect()}
                    />
                </DisplayField>

                <BasicModal
                    id={"login_code"}
                    buttonText={"Close"}
                    onSubmit={() => null}
                    style={{ alignItems: "center" }}
                >
                    <h1>Authorization Code</h1>
                    <p>Code: {this.state.code}</p>
                </BasicModal>
            </div>
        );
    }
}

export default Settings;
