import React from "react";
import { Container } from "react-bootstrap";
import SearchResultsElement from "../components/SearchResults";
import { Link } from "react-router-dom";
import { Pages } from "../constants";

const exampleSearchResults = {
    top: {
        title: "光るなら",
        artist: "Goose house",
        duration: 252133,
        url: "https://open.spotify.com/track/2BlDX1yfT0ea5wo0vjCKKa",
        icon: "https://i.scdn.co/image/ab67616d0000b2730735b9b1d06b65bbd8814825",
        id: "cWtgGTCAjYY"
    },
    results: [
        {
            title: "Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki Kirameki",
            artist: "Hikaru Station",
            duration: 145000,
            url: "https://open.spotify.com/track/2UO5jOiGCLKiLCm8O6qhCb?si=5cd496d912f34081",
            icon: "https://i.scdn.co/image/ab67616d00001e021d24f8fa55739bdf2fecfd24",
            id: "JPU901401920"
        },
        {
            title: "Firefox",
            artist: "Mozilla",
            duration: Infinity,
            url: "/",
            icon: "https://crepe.moe/c/fqOXk3F1",
            id: "JPU901401919"
        }
    ],
};

class SearchResultsPage extends React.Component {
    render() {
        return (
            <Container className="ContentContainer">
                <SearchResultsElement results={exampleSearchResults}></SearchResultsElement>
                <br />
                <Link to={Pages.home} style={{ color: "white", textDecoration: "underline" }}>Go To Home</Link>
            </Container>
        );
    }
}

export default SearchResultsPage;