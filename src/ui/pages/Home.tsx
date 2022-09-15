import React from "react";
import { Link } from "react-router-dom";
import { Pages } from "src/constants"

class HomePage extends React.Component<any, any> {
    render() {
        return (
            <div style={{ textAlign: "center", fontSize: 100, color: "white" }}>
                <h1>Home</h1>
                <Link to={Pages.settings}>settings</Link>
            </div>
        );
    }
}

export default HomePage;