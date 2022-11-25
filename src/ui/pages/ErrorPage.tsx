import React from "react";

import "@css/ErrorPage.scss";

class ErrorPage extends React.Component {
    render() {
        return (
            <div className="ErrorPage">
                <h2>Hmm? Something went wrong.</h2>
                <div className="ErrorPageMessage">
                    <p>
                        Looks like something went wrong. Try refreshing the app, or try again later. Perhaps the servers are down?
                    </p>
                    <p>
                        If this keeps happening, please report it on the{" "}
                        <a className="GithubLink" onClick={() => window.open("https://github.com/Dumbfuckery-Inc/Laudiolin")}>
                            GitHub repository
                        </a>
                    </p>
                </div>
            </div>
        );
    }
}

export default ErrorPage;