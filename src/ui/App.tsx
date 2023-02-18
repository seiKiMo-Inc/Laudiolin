import React from "react";

import TopButtons from "@components/TopButtons";
import ControlPanel from "@components/ControlPanel";
import NavPanel from "@components/NavPanel";
import ContentPanel from "@components/ContentPanel";
import TopBar from "@components/TopBar";

import "@css/App.scss";

interface IProps {
}

interface IState {
}

class App extends React.Component<IProps, IState> {

    render() {
        return (
            <>
                <TopButtons />
                <div className={"DragBar"} data-tauri-drag-region={true} />
                <div className={"AppContainer"}>
                    <NavPanel />
                    <TopBar />
                    <ContentPanel />
                    <ControlPanel />
                </div>
            </>
        );
    }
}

export default App;
