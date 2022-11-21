import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "@pages/Home";
import SearchResultsPage from "@pages/SearchResultsPage";
import SettingsPage from "@pages/SettingsPage";
import PlaylistPage from "@pages/PlaylistPage";
import TrackPage from "@pages/TrackPage";
import LoginPage from "@pages/LoginPage";

import { Pages } from "@app/constants";
import { player } from "@backend/audio";
import * as config from "@backend/settings";
import emitter from "@backend/events";

import Controls from "@components/player/Controls";
import Navigation from "@components/NavBar";
import TitleBar from "@components/TitleBar";

import "@css/App.scss";

interface IState {
    background: string;
}

class App extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        const darkMode = localStorage.getItem("darkMode") === "true";
        document.documentElement.classList.toggle("dark", darkMode);

        this.state = {
            background: config.ui().background_url
        }
    }

    // for the future (maybe)
    toggleDarkMode() {
        const darkMode = !document.documentElement.classList.contains("dark");
        localStorage.setItem("darkMode", darkMode.toString());
        document.documentElement.classList.toggle("dark", darkMode);
    }

    componentDidMount() {
        emitter.on("settingsReload", () => {
            config.reloadSettings().then(() => {
                this.setState({ background: config.ui().background_url });
            });
        })
    }

    render() {
        return (
            <Router>
                <>
                    <div
                        className="AppBackgroundImage"
                        style={{ backgroundImage: `url(${this.state.background})` }}
                    ></div>

                    <TitleBar />
                    {/* empty div to keep content below title bar */}
                    <div className="clearTop"></div>

                    <Navigation />

                    <Routes>
                        <Route path={Pages.login} element={<LoginPage />} />
                        <Route path={Pages.home} element={<HomePage />} />
                        <Route path={Pages.searchResults} element={<SearchResultsPage />} />
                        <Route path={Pages.settings} element={<SettingsPage />} />
                        <Route path={Pages.playlist} element={<PlaylistPage />} />
                        <Route path={Pages.track} element={<TrackPage />} />
                    </Routes>

                    {/* empty div to keep content above player */}
                    <div className="clearBottom"></div>

                    <Controls player={player} />
                </>
            </Router>
        );
    }
}

export default App;
