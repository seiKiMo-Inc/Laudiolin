import React from "react";

import Navigate from "@components/Navigate";
import emitter from "@backend/events";

class MainView extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className={"MainView"}>
                <Navigate />
                <button onClick={() => emitter.emit("miniPlayer", true)}>Mini</button>
            </div>
        );
    }
}

export default MainView;
