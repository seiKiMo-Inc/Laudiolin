import React from "react";
import "@css/App.scss";

import { Container } from "react-bootstrap";

import Controls from "@components/Controls";
import Navigation from "@components/NavBar";
import SearchResultsElement from "@components/SearchResults";
import TitleBar from "@components/TitleBar";
import SearchTrack from "@components/search/SearchTrack";

const exampleSearchResults = {
    top: {
        title: "光るなら",
        artist: "Goose house",
        duration: 252133,
        url: "https://open.spotify.com/track/2BlDX1yfT0ea5wo0vjCKKa",
        icon: "https://i.scdn.co/image/ab67616d0000b2730735b9b1d06b65bbd8814825",
    },
    results: [
        {
            title: "Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki",
            artist: "Hikaru Station",
            duration: 145000,
            url: "https://open.spotify.com/track/2UO5jOiGCLKiLCm8O6qhCb?si=5cd496d912f34081",
            icon: "https://i.scdn.co/image/ab67616d00001e021d24f8fa55739bdf2fecfd24",
        },
    ],
};

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
            <>
                <TitleBar />
                <Navigation />
                <Container className="ContentContainer">
                    <SearchResultsElement results={exampleSearchResults}></SearchResultsElement>
                </Container>
                <Controls />
            </>
        );
    }
}

export default App;
