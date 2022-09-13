import React from "react";
import { Link } from "react-router-dom";
import { Pages } from "../constants";

class HomePage extends React.Component {
    render() {
        return (
            <div style={{ textAlign: "center", fontSize: 100, color: "white" }}>
                <h1>Home</h1>
                <Link to={Pages.searchResults} style={{ fontSize: 20 }}>{'>'}go to search results</Link>
            </div>
        );
    }
}

export default HomePage;