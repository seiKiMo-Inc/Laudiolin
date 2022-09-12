import React from "react";
import { Link } from "react-router-dom";

class HomePage extends React.Component {
    render() {
        return (
            <div style={{ textAlign: "center", fontSize: 100, color: "white" }}>
                <h1>Home</h1>
                <Link to="/search-results" style={{ fontSize: 20 }}>{'>'}go to search results</Link>
            </div>
        );
    }
}

export default HomePage;