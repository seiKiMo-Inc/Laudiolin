import React from "react";

import Switch from "react-switch";

import BasicDropdown, { toggleDropdown } from "@components/common/BasicDropdown";
import BasicButton from "@components/common/BasicButton";

import type { SettingType } from "@backend/types";
import { offlineSupport } from "@backend/offline";
import * as settings from "@backend/settings";

import "@css/pages/Settings.scss";

interface ISetting {
    setting: string;
    description?: string;

    type?: SettingType;
    placeholder?: string | number | boolean;
    options?: string[];
    update?: (value: any) => void;
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
        <div
            className={"Setting"}
            style={{ marginBottom: props.description ? 40 : 20 }}
        >
            <div>
                <h3>{settings.settingsKeys[props.setting] ?? "Unknown"}</h3>
                { props.description && <p className={"Setting_Description"}>{props.description}</p> }
            </div>

            <div>
                { props.type == "input" &&
                    <InputField props={properties} /> }
                { props.type == "select" &&
                    <SelectField props={properties} /> }
                { props.type == "boolean" &&
                    <ToggleField props={properties} /> }
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
            onChange={event => props.set(event.target.value)}
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

    return (
        <>
            <BasicButton
                className={"Setting_Box"}
                text={value}
                onClick={() => toggleDropdown(props.setting)}
            />

            <BasicDropdown id={props.setting}>
                { props.options.map((option, index) =>
                    <a
                        key={index}
                        onClick={() => update(index)}
                    >{option}</a>) }
            </BasicDropdown>
        </>
    );
}

function ToggleField({ props }) {
    const [enabled, setEnabled] = React.useState<boolean>(
        typeof props.placeholder == "boolean" ? props.placeholder : false);

    return (
        <Switch
            onChange={state => {
                setEnabled(state);
                props.update?.(state);
            }}
            checked={enabled}
            onColor={"#3484FC"}
            checkedIcon={false}
            uncheckedIcon={false}
            width={40} height={20}
        />
    );
}

class Settings extends React.Component<{}, never> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <div className={"Settings"}>
                <h2 style={{ marginBottom: 30 }}>Settings</h2>

                <Setting setting={"search.engine"} type={"select"}
                         description={"The engine to query track searching."}
                         options={["YouTube", "Spotify", "All"]} />

                <h2 style={{ marginTop: 30, marginBottom: 30 }}>System</h2>

                <Setting setting={"system.offline"} type={"boolean"}
                         description={"This will make Laudiolin available while you're offline."}
                         update={state => offlineSupport(state)} />
                <Setting setting={"system.broadcast_listening"} type={"select"}
                         description={"Who should see what you're listening to?"}
                         options={["Everyone", "Friends", "Nobody"]} />
                <Setting setting={"system.presence"} type={"select"}
                         description={"What should your Discord presence look like?"}
                         options={["Generic", "Simple", "None"]} />

                <h2 style={{ marginTop: 30, marginBottom: 30 }}>Interface</h2>

                <Setting setting={"ui.color_theme"} type={"select"}
                         description={"The color palette to use."}
                         options={["Dark", "Light"]}
                         update={state => settings.setTheme(state)} />
                <Setting setting={"ui.background_color"} type={"input"} />
                <Setting setting={"ui.background_url"} type={"input"} />
            </div>
        );
    }
}

export default Settings;
