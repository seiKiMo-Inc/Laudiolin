import React from "react";
import { Container } from "react-bootstrap";

import * as config from "@backend/settings";
import type {
    SearchSettings, AudioSettings,
    GatewaySettings, UISettings, SearchEngine
} from "@backend/types";

import "@css/Settings.scss";

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

        this.setSearch = this.setSearch.bind(this);
        this.setAudio = this.setSearch.bind(this);
        this.setGateway = this.setGateway.bind(this);
        this.setUi = this.setUi.bind(this);
    }

    setSearch(accuracy: boolean, engine: SearchEngine) {
        this.setState({
            search: {
                accuracy: accuracy,
                engine: engine
            }
        });
    }

    setAudio(download_path: string) {
        this.setState({
            audio: {
                download_path: download_path
            }
        });
    }

    setGateway(encrypted: boolean, address: string, port: number, gateway_port: number) {
        this.setState({
            gateway: {
                encrypted: encrypted,
                address: address,
                port: port,
                gateway_port: gateway_port
            }
        });
    }

    setUi(background_color: string, background_url: string) {
        this.setState({
            ui: {
                background_color: background_color,
                background_url: background_url
            }
        });
    }

    async componentDidMount() {
        this.setState({
            search: config.search(),
            audio: config.audio(),
            gateway: config.gateway(),
            ui: config.ui()
        });

       await config.reloadSettings();
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        // TODO: Update settings from state.
    }

    render() {
        return (
            <Container className="SettingsContainer">
                <table className="SettingsOptions" id="search-settings">
                    <tr>
                        <th scope="row">Accuracy:</th>
                        <td>[checkbox]</td>
                    </tr>
                    <tr>
                        <th scope="row">Engine:</th>
                        <td>[dropdown]</td>
                    </tr>
                </table>
                <table className="SettingsOptions" id="audio-settings">
                    <tr>
                        <th scope="row">Downloads Folder:</th>
                        <td>[path]</td>
                    </tr>
                </table>
                <table className="SettingsOptions" id="gateway-settings">
                    <tr>
                        <th scope="row">Toggle Encryption:</th>
                        <td>[checkbox]</td>
                    </tr>
                    <tr>
                        <th scope="row">Address:</th>
                        <td>[input]</td>
                    </tr>
                    <tr>
                        <th scope="row">Port:</th>
                        <td>[input]</td>
                    </tr>
                    <tr>
                        <th scope="row">Gateway Port:</th>
                        <td>[input]</td>
                    </tr>
                </table>
                <table className="SettingsOptions" id="ui-settings">
                    <tr>
                        <th scope="row">Background Color:</th>
                        <td>[input]</td>
                    </tr>
                    <tr>
                        <th scope="row">Background URL:</th>
                        <td>[input]</td>
                    </tr>
                </table>
            </Container>
        );
    }
}

export default Settings;
