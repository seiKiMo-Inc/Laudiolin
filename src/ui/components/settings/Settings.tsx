import React from "react";
import Button from "@components/common/Button";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import emitter from "@backend/events";

import * as user from "@backend/user";
import * as config from "@backend/settings";
import * as gateway from "@backend/gateway";
import type { SearchEngine, UserSettings } from "@backend/types";

import Dropdown, { toggleDropdown } from "@components/common/Dropdown";

import { open } from "@tauri-apps/api/dialog";
import { appDataDir } from "@tauri-apps/api/path";

import "@css/Settings.scss";

interface IState {
    accuracy: boolean;
    engine: SearchEngine;
    download_path: string;
    encrypted: boolean;
    address: string;
    port: number;
    gateway_port: number;
    background_color: string;
    background_url: string;
    background_brightness: string;
}

class Settings extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            accuracy: false,
            engine: "YouTube",
            download_path: "downloads",
            encrypted: true,
            address: "app.seikimo.moe",
            port: 443,
            gateway_port: 443,
            background_color: "",
            background_url: "",
            background_brightness: "100%"
        };
    }

    setAccuracy = (accuracy: boolean) => {
        this.setState({
            accuracy: accuracy
        });
    };

    setEngine = (engine: SearchEngine) => {
        this.setState({
            engine: engine
        });
    };

    setDownloadPath = (download_path: string) => {
        this.setState({
            download_path: download_path
        });
    };

    setEncryption = (encrypted: boolean) => {
        this.setState({
            encrypted: encrypted
        });
    };

    setAddress = (address: string) => {
        this.setState({
            address: address
        });
    };

    setPort = (port: number) => {
        this.setState({
            port: port,
            gateway_port: port
        });
    };

    setBackgroundUrl = (background_url: string) => {
        this.setState({
            background_url: background_url
        });
    };

    setBackgroundBrightness = (background_brightness: string) => {
        this.setState({
            background_brightness: background_brightness
        });
    }

    selectDirectory = async () => {
        const result = await open({
            defaultPath: await appDataDir(),
            multiple: false,
            directory: true
        });

        if (result) {
            this.setDownloadPath(result as string);
        }
    };

    async componentDidMount() {
        await config.reloadSettings()
        await this.setState({
            accuracy: config.search().accuracy,
            engine: config.search().engine,
            download_path: config.audio().download_path,
            encrypted: config.gateway().encrypted,
            address: config.gateway().address,
            port: config.gateway().port,
            gateway_port: config.gateway().gateway_port,
            background_color: config.ui().background_color,
            background_url: config.ui().background_url,
            background_brightness: localStorage.getItem("background_brightness") || "100"
        });
    }

    async componentWillUnmount() {
        await config.saveSettings({
            search: {
                accuracy: this.state.accuracy,
                engine: this.state.engine
            },
            audio: {
                download_path: this.state.download_path
            },
            gateway: {
                encrypted: this.state.encrypted,
                address: this.state.address,
                port: this.state.port,
                gateway_port: this.state.gateway_port
            },
            ui: {
                background_color: this.state.background_color,
                background_url: this.state.background_url
            },
            token: config.getSettings().token
        } as UserSettings);
        localStorage.setItem("background_brightness", this.state.background_brightness);

        gateway.gateway.close();
        gateway.setupGateway(config.gateway());
        user.loadRoute(); // Load the gateway route.
        emitter.emit("settingsReload");
    }

    render() {
        return (
            <table className="SettingsOptions">
                <tbody>
                    <tr className="SettingsHeadings">
                        <th>Search Settings</th>
                    </tr>
                    <tr>
                        <th scope="row">Accuracy:</th>
                        <td>
                            <input
                                type="checkbox"
                                id="check"
                                checked={this.state.accuracy}
                                onChange={(e) => this.setAccuracy(e.currentTarget.checked)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Engine:</th>
                        <td>
                            <Dropdown id="engineDropdown" buttonText={this.state.engine} useButton={true}>
                                <p
                                    onClick={() => {
                                        this.setEngine("YouTube" as SearchEngine);
                                        toggleDropdown("engineDropdown");
                                    }}
                                >
                                    YouTube
                                </p>
                                <p
                                    onClick={() => {
                                        this.setEngine("Spotify" as SearchEngine);
                                        toggleDropdown("engineDropdown");
                                    }}
                                >
                                    Spotify
                                </p>
                                <p
                                    onClick={() => {
                                        this.setEngine("SoundCloud" as SearchEngine);
                                        toggleDropdown("engineDropdown");
                                    }}
                                >
                                    SoundCloud
                                </p>
                                <p
                                    onClick={() => {
                                        this.setEngine("All" as SearchEngine);
                                        toggleDropdown("engineDropdown");
                                    }}
                                >
                                    All
                                </p>
                            </Dropdown>
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr className="SettingsHeadings">
                        <th>Audio Settings</th>
                    </tr>
                    <tr>
                        <th scope="row">Downloads Folder:</th>
                        <td>
                            <input className="dirInputText" type="text" value={this.state.download_path} readOnly />
                            <Button
                                className="dirSelector"
                                icon={faFolder}
                                onClick={() => this.selectDirectory()}
                            />
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr className="SettingsHeadings">
                        <th>Gateway Settings</th>
                    </tr>
                    <tr>
                        <th scope="row">Toggle Encryption:</th>
                        <td>
                            <input
                                type="checkbox"
                                id="check"
                                checked={this.state.encrypted}
                                onChange={(e) =>
                                    e.currentTarget.checked ? this.setEncryption(true) : this.setEncryption(false)
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Address:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="text"
                                value={this.state.address}
                                onInput={(e) => this.setAddress(e.currentTarget.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Port:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="number"
                                min={1}
                                value={this.state.port}
                                onInput={(e) => this.setPort(e.currentTarget.valueAsNumber)}
                            />
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr className="SettingsHeadings">
                        <th>UI Settings</th>
                    </tr>
                    <tr>
                        <th scope="row">Background URL:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="text"
                                placeholder="https://example.com/image.png"
                                value={this.state.background_url}
                                onInput={(e) => this.setBackgroundUrl(e.currentTarget.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Background Brightness:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="number"
                                min={0}
                                max={100}
                                style={{ width: "166px" }}
                                value={parseInt(this.state.background_brightness)}
                                onInput={(e) => this.setBackgroundBrightness(e.currentTarget.value)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default Settings;
