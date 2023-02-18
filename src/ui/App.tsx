import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import TopButtons from "@components/TopButtons";
import ControlPanel from "@components/ControlPanel";
import NavPanel from "@components/NavPanel";
import MainView from "@components/MainView";
import TopBar from "@components/TopBar";

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
                <div className={"DragBar"} data-tauri-drag-region={true} />
                <div className={"AppContainer"}>
                    <NavPanel />
                    <TopBar />
                    <ContentPanel />
                    <ControlPanel />
                </div>
            </Router>
        );
    }
}

export default App;
