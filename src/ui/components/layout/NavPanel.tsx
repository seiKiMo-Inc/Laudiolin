import React from "react";

import CurrentUser from "@components/nav/CurrentUser";

import "@css/NavPanel.scss";

interface IProps {
    isLoggedIn: boolean;
}

class NavPanel extends React.Component<IProps, never> {
    render() {
        return (
            <div className={"NavPanel"}>
                <CurrentUser isLoggedIn={false} />
            </div>
        );
    }
}

export default NavPanel;
