import React from "react";

import Switch from "react-switch";
import ReactSlider from "rc-slider/es";
import { Tooltip } from "react-tooltip";
import Collapsible from "react-collapsible";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";

import { BiChevronDown } from "react-icons/bi";

import BasicDropdown, { toggleDropdown } from "@components/common/BasicDropdown";
import BasicButton from "@components/common/BasicButton";

import AnimatedView from "@components/common/AnimatedView";

import * as settings from "@backend/settings";
import { connect } from "@backend/social/gateway";
// #v-ifdef VITE_BUILD_ENV='desktop'
import { invoke } from "@tauri-apps/api";
import { offlineSupport } from "@backend/desktop/offline";
// #v-endif
import type { SettingType } from "@app/types";
import WithStore, { Settings as SettingsStore, useSettings } from "@backend/stores";

import "@css/pages/Settings.scss";

type SettingProperties = ISetting & { set: (value: any) => void; };

interface ISetting {
    store: SettingsStore;
    exact?: any | undefined;

    setting: string;
    description?: string;

    type?: SettingType;
    placeholder?: string | number | boolean;
    options?: string[];
    update?: (value: any) => void;
    color?: string;
}

function Setting(props: ISetting) {
   const placeholder = props.exact ?? props.store.getFromPath(props.setting, "");

    const properties = {
        ...props,
        placeholder,
        set: (value: any) => {
            props.store.setFromPath(props.setting, value);
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

            <div className={`Settings_Field_${props.type}`}>
                {props.type == "input" && <InputField props={properties} placeholder={placeholder} />}
                {props.type == "number" && <InputField props={properties} placeholder={placeholder} numbers />}
                {props.type == "select" && <SelectField props={properties} placeholder={placeholder} />}
                {props.type == "boolean" && <ToggleField props={properties} placeholder={placeholder} />}
                {props.type == "color" && <ColorField props={properties} placeholder={placeholder} />}
                {props.type == "slider" && <SliderField props={properties} placeholder={placeholder} />}
            </div>
        </div>
    );
}

function InputField({ props, placeholder, numbers = false }) {
    return (
        <input
            className={"Setting_Box Setting_Input"}
            type={numbers ? "number" : "text"}
            placeholder={placeholder}
            onChange={(event) => props.set(event.target.value)}
        />
    );
}

function SelectField({ props, placeholder }) {
    const update = (index: number) => {
        toggleDropdown(props.setting);
        props.set(props.options[index]);
    };

    return (
        <>
            <BasicButton
                className={"Setting_Box dropbtn"}
                id={props.setting + "_button"}
                text={placeholder}
                icon={<BiChevronDown />}
                onClick={() => toggleDropdown(props.setting)}
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

function ToggleField({ props, placeholder }) {
    const [enabled, setEnabled] = React.useState<boolean>(
        typeof placeholder == "string"
            ? placeholder == "true"
            : placeholder
    );

    return (
        <Switch
            onChange={(state) => {
                setEnabled(state);
                props.set(state);
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

interface IColorProps {
    props: SettingProperties;
    placeholder: string;
}

function ColorField({ props, placeholder }: IColorProps) {
    const [inPicker, setInPicker] = React.useState(false);
    const [showPicker, setShowPicker] = React.useState(false);

    return (
        <>
            <HexColorInput
                className={"Settings_Color_Input"}
                color={placeholder}
                onChange={props.set}
                prefixed alpha
                onMouseDown={() => setShowPicker(true)}
                onBlur={() => {
                    if (!inPicker) setShowPicker(false);
                }}
            />

            {showPicker && (
                <HexAlphaColorPicker
                    className={"Settings_Color_Picker"}
                    color={placeholder}
                    onChange={props.set}
                    onMouseEnter={() => setInPicker(true)}
                    onMouseLeave={() => {
                        setInPicker(false);
                        setShowPicker(false);
                    }}
                />
            )}
        </>
    );
}

interface ISliderProps {
    props: SettingProperties;
    placeholder: string | number;
}

function SliderField({ props, placeholder }: ISliderProps) {
    // Parse the placeholder into a number.
    const value = (typeof placeholder == "string" ?
        parseInt(placeholder) : placeholder) * 100;
    const tooltipId = `${props.setting}_tooltip`;

    const [activeThumb, setActiveThumb] = React.useState(false);

    return (
        <div
            className={"Setting_Slider_Container"}
            onMouseEnter={() => setActiveThumb(true)}
            onMouseLeave={() => setActiveThumb(false)}
            data-tooltip-content={`${Math.trunc(Math.round(value))}%`}
            data-tooltip-float={true}
            data-tooltip-id={tooltipId}
        >
            <ReactSlider
                className={"Setting_Slider"}
                min={0}
                max={100}
                value={value}
                onChange={(newValue: number) => {
                    props.set(newValue / 100);
                }}
                trackStyle={{
                    backgroundColor: "var(--accent-color)"
                }}
                handleStyle={{
                    display: activeThumb ? "block" : "none",
                    borderColor: "var(--accent-color)",
                    backgroundColor: "white"
                }}
                railStyle={{
                    backgroundColor: "var(--background-secondary-color)"
                }}
                draggableTrack={true}
            />

            <Tooltip id={tooltipId} />
        </div>
    );
}

interface ICategoryProps {
    name: string;
    children: React.ReactNode[];
}

function Category({ name, children }: ICategoryProps) {
    return (
        <Collapsible
            trigger={name}
            triggerClassName={"Settings_Category_Trigger"}
            triggerOpenedClassName={"Settings_Category_Trigger"}
            className={"Settings_Category"}
            openedClassName={"Settings_Category"}
            contentInnerClassName={"Settings_Category_Content"}
        >
            {children}
        </Collapsible>
    );
}

interface IProps {
    pStore: SettingsStore;
}

interface IState {
    color: string;
}

class Settings extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            color: settings.ui().color_theme == "Light" ? "#ED7D64" : "#3484FC"
        };
    }

    render() {
        const store = this.props.pStore;

        return (
            <AnimatedView>
                <div className={"Settings"}>
                    <h2 style={{ marginBottom: 20 }}>Settings</h2>

                    <Setting
                        store={store}
                        exact={store.search.engine}
                        setting={"search.engine"}
                        type={"select"}
                        description={"The engine to query track searching."}
                        options={["YouTube", "Spotify", "All"]}
                    />

                    <h2 style={{ marginTop: 30, marginBottom: 20 }}>Audio</h2>

                    <Setting
                        store={store}
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
                            store={store}
                            setting={"audio.audio_quality"}
                            type={"select"}
                            description={"The quality of the streamed audio."}
                            options={["Low", "Medium", "High"]}
                        />
                    )}

                    <Setting
                        store={store}
                        setting={"audio.stream_sync"}
                        type={"boolean"}
                        description={
                            "If enabled, audio will be always be streamed when listening along."
                        }
                        color={this.state.color}
                    />

                    <Setting
                        store={store}
                        setting={"audio.master_volume"}
                        type={"slider"}
                        description={"The base volume of the audio."}
                    />

                    <h2 style={{ marginTop: 30, marginBottom: 20 }}>Interface</h2>

                    <Setting
                        store={store}
                        setting={"ui.color_theme"}
                        type={"select"}
                        description={"The color palette to use. This will change your custom palette."}
                        options={["Dark", "Light"]}
                        update={(state) => {
                            store.resetTheme(state);
                            settings.setTheme(state);
                            this.setState({
                                color: state == "Light" ? "#ED7D64" : "#3484FC"
                            });
                        }}
                    />

                    <Category name={"Wallpaper"}>
                        <Setting
                            store={store}
                            setting={"ui.background_image"}
                            type={"input"}
                            description={"The URL to an image to use as the background."}
                        />

                        <Setting
                            store={store}
                            setting={"ui.background_opacity"}
                            type={"number"}
                            description={"The opacity of the background colors when an image is applied."}
                            update={(state) => {
                                if (typeof state != "number") {
                                    state = parseInt(state);
                                }

                                if (state > 100) state = 100;
                                if (state < 0) state = 0;

                                store.setFromPath("ui.background_opacity", Math.round(state));
                            }}
                        />
                    </Category>

                    <Category name={"Color Palette"}>
                        <DisplayField text={"Reset to Defaults"}
                                      description={"This will RELOAD the interface."}
                        >
                            <BasicButton
                                text={"Reset"}
                                className={"Setting_Box Setting_Button"}
                                onClick={() => {
                                    this.props.pStore.resetTheme(store.ui.color_theme);
                                    setTimeout(() => location.reload(), 1e3);
                                }}
                            />
                        </DisplayField>

                        <Setting
                            store={store}
                            setting={"ui.theme.background.primary"}
                            exact={store.ui.theme.background.primary}
                            type={"color"}
                        />

                        <Setting
                            store={store}
                            setting={"ui.theme.background.secondary"}
                            exact={store.ui.theme.background.secondary}
                            type={"color"}
                        />

                        <Setting
                            store={store}
                            setting={"ui.theme.icon.primary"}
                            exact={store.ui.theme.icon.primary}
                            type={"color"}
                        />

                        <Setting
                            store={store}
                            setting={"ui.theme.icon.secondary"}
                            exact={store.ui.theme.icon.secondary}
                            type={"color"}
                        />

                        <Setting
                            store={store}
                            setting={"ui.theme.text.primary"}
                            exact={store.ui.theme.text.primary}
                            type={"color"}
                        />

                        <Setting
                            store={store}
                            setting={"ui.theme.text.secondary"}
                            exact={store.ui.theme.text.secondary}
                            type={"color"}
                        />

                        <Setting
                            store={store}
                            setting={"ui.theme.text.tertiary"}
                            exact={store.ui.theme.text.tertiary}
                            type={"color"}
                        />

                        <Setting
                            store={store}
                            setting={"ui.theme.accent"}
                            exact={store.ui.theme.accent}
                            type={"color"}
                        />
                    </Category>

                    <Category name={"UI Elements"}>
                        <Setting
                            store={store}
                            setting={"ui.show_search_engine"}
                            type={"boolean"}
                            description={"Controls whether the search engine dropdown in the search bar is shown."}
                            color={this.state.color}
                        />

                        <Setting
                            store={store}
                            setting={"ui.show_elixir"}
                            type={"boolean"}
                            description={"Controls whether the Elixir tab is shown in the navigation sidebar."}
                            color={this.state.color}
                        />

// #v-ifdef VITE_BUILD_ENV='desktop'
                        <Setting
                            store={store}
                            setting={"ui.show_downloads"}
                            type={"boolean"}
                            description={"Controls whether the Downloads tab is shown in the navigation sidebar."}
                            color={this.state.color}
                        />
// #v-endif

                        <Setting
                            store={store}
                            setting={"ui.show_favorites"}
                            type={"boolean"}
                            description={"Controls whether the Favorites tab is shown in the navigation sidebar."}
                            color={this.state.color}
                        />

                        <Setting
                            store={store}
                            setting={"ui.show_recents"}
                            type={"boolean"}
                            description={"Controls whether the Recents tab is shown in the navigation sidebar."}
                            color={this.state.color}
                        />

                        <Setting
                            store={store}
                            setting={"ui.show_home"}
                            type={"boolean"}
                            description={"Controls whether the Home tab is shown in the navigation sidebar."}
                            color={this.state.color}
                        />
                    </Category>

                    <h2 style={{ marginTop: 30, marginBottom: 20 }}>System</h2>

// #v-ifdef VITE_BUILD_ENV='desktop'
                    <Setting
                        store={store}
                        setting={"system.offline"}
                        type={"boolean"}
                        description={
                            "This will make Laudiolin available while you're offline."
                        }
                        update={(state) => offlineSupport(state == "true")}
                        color={this.state.color}
                    />
// #v-endif
                    <Setting
                        store={store}
                        setting={"system.broadcast_listening"}
                        type={"select"}
                        description={"Who should see what you're listening to?"}
                        options={["Everyone", "Friends", "Nobody"]}
                    />
                    <Setting
                        store={store}
                        setting={"system.presence"}
                        type={"select"}
                        description={"What should your Discord presence look like?"}
                        options={["Generic", "Simple", "Detailed", "None"]}
                    />
// #v-ifdef VITE_BUILD_ENV='desktop'
                    <Setting
                        store={store}
                        setting={"system.close"}
                        type={"select"}
                        description={"Changes the behavior of the close button."}
                        options={["Exit", "Tray"]}
                    />
// #v-endif

                    <h2 style={{ marginTop: 30, marginBottom: 20 }}>Debugging Actions</h2>

                    <DisplayField text={"Reconnect to Gateway"}>
                        <BasicButton
                            text={"Reconnect"}
                            className={"Setting_Box Setting_Button"}
                            onClick={() => connect()}
                        />
                    </DisplayField>

// #v-ifdef VITE_BUILD_ENV='desktop'
                    <DisplayField text={"Open DevTools"}>
                        <BasicButton
                            text={"Open"}
                            className={"Setting_Box Setting_Button"}
                            onClick={async () => invoke("open_dev_tools")}
                        />
                    </DisplayField>
// #v-endif

                    <h2 style={{ marginTop: 30, marginBottom: 20 }}>Key Binds</h2>

                    <DisplayField text={"Toggle Track State"} description={"Toggles between play and pause when pressed"}>
                        <span className={"Key"}>SpaceBar</span>
                    </DisplayField>

                    <DisplayField text={"Next Track"} description={"Skips to the next track"}>
                        <span className={"Key"}>Ctrl</span>
                        <span className={"Key"}>&#8594;</span>
                    </DisplayField>

                    <DisplayField text={"Previous Track"} description={"Skips to the previous track"}>
                        <span className={"Key"}>Ctrl</span>
                        <span className={"Key"}>&#8592;</span>
                    </DisplayField>

                    <DisplayField text={"Shuffle Queue"} description={"Shuffles the queue"}>
                        <span className={"Key"}>Ctrl</span>
                        <span className={"Key"}>S</span>
                    </DisplayField>

                    <DisplayField text={"Repeat Queue"} description={"Repeats the queue or the current track"}>
                        <span className={"Key"}>Ctrl</span>
                        <span className={"Key"}>R</span>
                    </DisplayField>

                    <DisplayField text={"Favorite Track"} description={"Marks the current track as favorite"}>
                        <span className={"Key"}>Ctrl</span>
                        <span className={"Key"}>F</span>
                    </DisplayField>

                    <DisplayField text={"Show Queue"} description={"Shows the queue"}>
                        <span className={"Key"}>Ctrl</span>
                        <span className={"Key"}>Q</span>
                    </DisplayField>

                    <DisplayField text={"Toggle Mute"} description={"Toggles between mute and unmute"}>
                        <span className={"Key"}>Ctrl</span>
                        <span className={"Key"}>M</span>
                    </DisplayField>
                </div>
            </AnimatedView>
        );
    }
}

export default WithStore(Settings, useSettings);
