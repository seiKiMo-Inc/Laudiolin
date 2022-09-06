import React from "react";
import "./App.css";

import { Container, Button } from "react-bootstrap";

import Navigation from "components/NavBar";
import Controls from "components/Controls";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

interface IProps {}
interface IState {
    showControls: boolean;
    darkMode: boolean;
}
class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            showControls: true,
            darkMode: false,
        };
    }

    // for the future (maybe)
    toggleDarkMode() {
        this.setState({ darkMode: !this.state.darkMode });
        document.documentElement.classList.toggle("dark");
    }

    componentDidMount() {
        document.documentElement.classList.toggle("dark");
    }

    render() {
        return (

            <>
                <Navigation />
                <Container style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                    <h1 className="text-3xl">Hello world!</h1>
                    <br />
                    <Button variant="primary" onClick={() => this.setState({ showControls: !this.state.showControls })}>
                        <FontAwesomeIcon icon={faLink} />
                        Toggle Controls
                    </Button>
                </Container>

                {this.state.showControls && <Controls />}
                <SearchResultsElement results={exampleSearchResults}></SearchResultsElement>
            </>
        );
    }
}

export default App;
