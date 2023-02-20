import React from "react";

import TopButtons from "@layout/TopButtons";
import ControlPanel from "@layout/ControlPanel";
import NavPanel from "@layout/NavPanel";
import MainView from "@layout/MainView";
import TopBar from "@layout/TopBar";

import emitter from "@backend/events";
import { login, userData } from "@backend/user";

import "@css/App.scss";
import "@css/Text.scss";

interface IProps {

}

interface IState {

}

class App extends React.Component<IProps, IState> {
    /**
     * Login/Logout callback method.
     */
    reloadUser = () => {
        this.forceUpdate();
    };

    constructor(props: IProps) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {
        emitter.on("login", this.reloadUser);
        emitter.on("logout", this.reloadUser);

        // Attempt to log in.
        login().catch(err => console.warn(err))
    }

    componentWillUnmount() {
        emitter.off("login", this.reloadUser);
        emitter.off("logout", this.reloadUser);
    }

    render() {
        return (
            <>
                <TopButtons />
                <div className={"AppContainer"}>
                    <NavPanel user={userData} />
                    <TopBar />
                    <MainView />
                    <ControlPanel />
                </div>
            </>
        );
    }
}

export default App;
