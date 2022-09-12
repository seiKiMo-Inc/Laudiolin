import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import "@css/App.scss";

import HomePage from "./pages/Home";
import SearchResultsPage from "./pages/SearchResultsPage";

import Controls from "@components/Controls";
import Navigation from "@components/NavBar";
import TitleBar from "@components/TitleBar";

interface IProps { }
interface IState { }
class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const darkmode = localStorage.getItem("darkMode") === "true";
        document.documentElement.classList.toggle("dark", darkmode);
    }

    // for the future (maybe)
    toggleDarkMode() {
        const darkmode = !document.documentElement.classList.contains("dark");
        localStorage.setItem("darkMode", darkmode.toString());
        document.documentElement.classList.toggle("dark", darkmode);
    }

    render() {
        return (
            <Router>
                <>
                    <TitleBar />
                    <Navigation />
                    {/* I recommend making a CONSTANTS file for page names to not make it hassle for changing names everywhere */}
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search-results" element={<SearchResultsPage />} />
                    </Routes>
                    <Controls />
                </>
            </Router>
        );
    }
}

export default App;
