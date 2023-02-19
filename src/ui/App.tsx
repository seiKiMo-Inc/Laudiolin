import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import TopButtons from "@layout/TopButtons";
import ControlPanel from "@layout/ControlPanel";
import NavPanel from "@layout/NavPanel";
import MainView from "@layout/MainView";
import TopBar from "@layout/TopBar";

import "@css/App.scss";

interface IProps {
}

interface IState {
}

class App extends React.Component<IProps, IState> {

    render() {
        return (
            <Router>
                <TopButtons />
                <div className={"AppContainer"}>
                    <NavPanel isLoggedIn={true} />
                    <TopBar />
                    <MainView />
                    <ControlPanel />
                </div>
            </Router>
        );
    }
}

export default App;
