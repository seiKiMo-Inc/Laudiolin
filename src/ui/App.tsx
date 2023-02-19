import React from "react";

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
    constructor(props: IProps) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <>
                <TopButtons />
                <div className={"AppContainer"}>
                    <NavPanel isLoggedIn={true} />
                    <TopBar />
                    <MainView />
                    <ControlPanel />
                </div>
            </>
        );
    }
}

export default App;
