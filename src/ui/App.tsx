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
        title: "Firefox",
        artist: "Mozilla",
        duration: Infinity,
        url: "https://crepe.moe/fqOXk3F1",
        icon: "https://crepe.moe/c/fqOXk3F1",
    },
    results: [
        {
            title: "Best song ever",
            artist: "Heretic",
            duration: Infinity,
            url: "",
            icon: "https://crepe.moe/c/Ojwx9dUB",
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
                <Container style={{ paddingBottom: "20%", overflowY: "auto" }}>
                    {/* <SearchResultsElement results={exampleSearchResults}></SearchResultsElement> */}
                    <SearchTrack title={"光るなら"} artist={"Goose house"} icon={"https://i.scdn.co/image/ab67616d0000b2730735b9b1d06b65bbd8814825"} url={"https://open.spotify.com/track/2BlDX1yfT0ea5wo0vjCKKa"} duration={252133} />
                </Container>
                <Controls />
            </>
        );
    }
}

export default App;
