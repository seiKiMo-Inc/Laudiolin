import React from "react";

import Navigate from "@components/Navigate";

class MainView extends React.Component<any> {
    constructor(props: any) {
        super(props);
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
