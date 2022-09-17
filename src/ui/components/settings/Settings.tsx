import React from "react";

import * as config from "@backend/settings";
import type { AudioSettings, GatewaySettings, SearchEngine, SearchSettings, UISettings } from "@backend/types";

import "@css/Settings.scss";
import Button from "@components/Button";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { open } from "@tauri-apps/api/dialog";
import { appDir } from "@tauri-apps/api/path";

interface IProps {

}

interface IState {
    search: SearchSettings,
    audio: AudioSettings,
    gateway: GatewaySettings,
    ui: UISettings
}

class Settings extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            search: config.search(),
            audio: config.audio(),
            gateway: config.gateway(),
            ui: config.ui()
        };
    }

    setSearch = (accuracy?: boolean, engine?: SearchEngine) => {
        this.setState({
            search: {
                accuracy: accuracy,
                engine: engine
            }
        });
    };

    setAudio = (download_path: string) => {
        this.setState({
            audio: {
                download_path: download_path
            }
        });
    };

    setGateway = (encrypted?: boolean, address?: string, port?: number, gateway_port?: number) => {
        this.setState({
            gateway: {
                encrypted: encrypted,
                address: address,
                port: port,
                gateway_port: gateway_port
            }
        });
    };

    setUi = (background_color?: string, background_url?: string) => {
        this.setState({
            ui: {
                background_color: background_color,
                background_url: background_url
            }
        });
    };

    toggleDropdown = () => {
        document.getElementById("engineDropdown").classList.toggle("show");
    };

    async componentDidMount() {
        this.setState({
            search: config.search(),
            audio: config.audio(),
            gateway: config.gateway(),
            ui: config.ui()
        });

        await config.reloadSettings();
    }

    DirSelectorFunction = async () => {
        const result = await open({
            defaultPath: await appDir(),
            multiple: false,
            directory: true
        });

        if (result) {
            this.setAudio(result as string);
        }
    };

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        // TODO: Update settings from state.
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
                            <input type="checkbox" id="check"
                                   onChange={(e) => e.currentTarget.checked ? this.setSearch(true) : this.setSearch(false)} />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Engine:</th>
                        <td>
                            <button onClick={this.toggleDropdown}
                                    className="dropbtn">Search Engine</button>
                            <div id="engineDropdown" className="dropdown-content">
                                <p onClick={() => {
                                    this.setSearch(...[], "YouTube" as SearchEngine);
                                    this.toggleDropdown();
                                }}>YouTube</p>
                                <p onClick={() => {
                                    this.setSearch(...[], "Spotify" as SearchEngine);
                                    this.toggleDropdown();
                                }}>Spotify</p>
                                <p onClick={() => {
                                    this.setSearch(...[], "SoundCloud" as SearchEngine);
                                    this.toggleDropdown();
                                }}>SoundCloud</p>
                                <p onClick={() => {
                                    this.setSearch(...[], "All" as SearchEngine);
                                    this.toggleDropdown();
                                }}>All</p>
                            </div>
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
                            <input
                                className="dirInputText"
                                type="text"
                                value={this.state.audio.download_path}
                                readOnly
                            />
                            <Button className="dirSelector" icon={faFolder}
                                    onClick={async () => this.DirSelectorFunction()} />
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
                            <input type="checkbox" id="check"
                                   onChange={(e) => e.currentTarget.checked ? this.setGateway(true) : this.setGateway(false)} />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Address:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="text"
                                value={this.state.gateway.address}
                                onInput={(e) => this.setGateway(...[], e.currentTarget.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Port:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="number"
                                value={this.state.gateway.port}
                                onInput={(e) => this.setGateway(...[], ...[], e.currentTarget.valueAsNumber)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Gateway Port:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="number"
                                value={this.state.gateway.gateway_port}
                                onInput={(e) => this.setGateway(...[], ...[], ...[], e.currentTarget.valueAsNumber)}
                            />
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr className="SettingsHeadings">
                        <th>UI Settings</th>
                    </tr>
                    <tr>
                        <th scope="row">Background Color:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="text"
                                placeholder="#000000"
                                value={this.state.ui.background_color}
                                onInput={(e) => this.setUi(e.currentTarget.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Background URL:</th>
                        <td>
                            <input
                                className="normalInputText"
                                type="text"
                                placeholder="https://example.com/image.png"
                                value={this.state.ui.background_url}
                                onInput={(e) => this.setUi(...[], e.currentTarget.value)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default Settings;
