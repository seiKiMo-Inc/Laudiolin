import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import HomePage from "@pages/Home";
import SearchResultsPage from "@pages/SearchResultsPage";
import { Pages } from "@app/constants";

import Controls from "@components/Controls";
import Navigation from "@components/NavBar";
import TitleBar from "@components/TitleBar";

import "@css/App.scss";

class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        const darkMode = localStorage.getItem("darkMode") === "true";
        document.documentElement.classList.toggle("dark", darkMode);
    }

    // for the future (maybe)
    toggleDarkMode() {
        const darkMode = !document.documentElement.classList.contains("dark");
        localStorage.setItem("darkMode", darkMode.toString());
        document.documentElement.classList.toggle("dark", darkMode);
    }

    render() {
        return (
            <Router>
                <>
                    <TitleBar />

                    <Navigation />

                    <Routes>
                        <Route path={Pages.home} element={<HomePage />} />
                        <Route path={Pages.searchResults} element={<SearchResultsPage />} />
                    </Routes>

                    <Controls />
                </>
            </Router>
        );
    }
}

export default App;
