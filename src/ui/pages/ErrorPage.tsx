import React from "react";
import { open } from '@tauri-apps/api/shell';

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
                        <a className="GithubLink" onClick={async () => await open('https://github.com/seiKiMo-Inc/Laudiolin')}>
                            GitHub repository
                        </a>
                    </p>
                </div>
            </div>
        );
    }
}

export default ErrorPage;