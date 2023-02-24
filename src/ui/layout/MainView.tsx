import React from "react";

import Navigate from "@components/Navigate";

import { toMini } from "@app/utils";

class MainView extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className={"MainView"}>
                <Navigate />
                <button onClick={() => toMini(true)}>Mini</button>
            </div>
        );
    }
}

export default MainView;
