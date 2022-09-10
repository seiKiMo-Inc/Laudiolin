import React from "react";
import "css/App.scss";

import { Container } from "react-bootstrap";

import Controls from "components/Controls";
import Navigation from "components/NavBar";
import SearchResultsElement from "./components/SearchResults";

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
                <Navigation />
                <Container style={{ paddingBottom: "20%" }}>
                    {/*<SearchResultsElement results={exampleSearchResults}></SearchResultsElement>*/}
                </Container>
                <Controls />
            </>
        );
    }
}

export default App;
