import React from "react";

import Navigate from "@components/Navigate";

interface IState {
    lightTheme: boolean;
}

class MainView extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            lightTheme: false
        }
    }

    render() {
        return (
            <div className={"MainView"}>
                <Navigate />
            </div>
        );
    }
}

export default MainView;
