import React from "react";

import CurrentUser from "@components/nav/CurrentUser";
import NavPageList from "@components/nav/NavPageList";
import Playlists from "@components/nav/Playlists";

import type { User } from "@app/types";

import "@css/layout/NavPanel.scss";

interface IProps {
    user?: User;
}

class NavPanel extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div className={"NavPanel"}>
                <CurrentUser user={this.props.user} />
                <NavPageList />
                <Playlists />
            </div>
        );
    }
}

export default NavPanel;
