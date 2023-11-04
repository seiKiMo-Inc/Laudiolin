import React from "react";

import CurrentUser from "@components/nav/CurrentUser";
import NavPageList from "@components/nav/NavPageList";
import Playlists from "@components/nav/Playlists";

import type { User } from "@app/types";
import { usePlaylists } from "@backend/stores";

import "@css/layout/NavPanel.scss";

interface IProps {
    user?: User;
}

function NavPanel(props: IProps) {
    const playlists = usePlaylists();

    return (
        <div className={"NavPanel"}>
            <CurrentUser user={props.user} />
            <NavPageList user={props.user} />
            <Playlists playlists={Object.values(playlists)} />
        </div>
    );
}

export default NavPanel;
