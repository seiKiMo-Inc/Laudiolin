import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import TopButtons from "@components/layout/TopButtons";
import ControlPanel from "@components/layout/ControlPanel";
import NavPanel from "@components/layout/NavPanel";
import MainView from "@components/layout/MainView";
import TopBar from "@components/layout/TopBar";

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
                    <NavPanel />
                    <TopBar />
                    <MainView />
                    <ControlPanel />
                </div>
            </Router>
        );
    }
}

export default App;
